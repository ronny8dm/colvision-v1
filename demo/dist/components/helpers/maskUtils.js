import { generatePolygonSegments, convertSegmentsToSVG } from "./trace";
import { Tensor } from "onnxruntime-web";
const ort = require("onnxruntime-web");
// Functions for handling mask output from the ONNX model
// Convert the onnx model mask prediction to ImageData
function arrayToImageData(input, width, height) {
    const [r, g, b, a] = [0, 114, 189, 255]; // the masks's blue color
    const arr = new Uint8ClampedArray(4 * width * height).fill(0);
    for (let i = 0; i < input.length; i++) {
        // Threshold the onnx model mask prediction at 0.0
        // This is equivalent to thresholding the mask using predictor.model.mask_threshold
        // in python
        if (input[i] > 0.0) {
            arr[4 * i + 0] = r;
            arr[4 * i + 1] = g;
            arr[4 * i + 2] = b;
            arr[4 * i + 3] = a;
        }
    }
    return new ImageData(arr, height, width);
}
// Use a Canvas element to produce an image from ImageData
function imageDataToImage(imageData) {
    const canvas = imageDataToCanvas(imageData);
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
}
// Canvas elements can be created from ImageData
function imageDataToCanvas(imageData) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx?.putImageData(imageData, 0, 0);
    return canvas;
}
// Convert the onnx model mask output to an HTMLImageElement
export function onnxMaskToImage(input, width, height) {
    return imageDataToImage(arrayToImageData(input, width, height));
}
/**
 * Functions for handling and tracing masks.
 */
// const {
//   generatePolygonSegments,
//   convertSegmentsToSVG,
// } = require("./custom_tracer");
/**
 * Converts mask array into RLE array using the fortran array
 * format where rows and columns are transposed. This is the
 * format used by the COCO API and is expected by the mask tracer.
 * @param {Array<number>} input
 * @param {number} nrows
 * @param {number} ncols
 * @returns array of integers
 */
export function maskDataToFortranArrayToRle(input, nrows, ncols) {
    const result = [];
    let count = 0;
    let bit = false;
    for (let c = 0; c < ncols; c++) {
        for (let r = 0; r < nrows; r++) {
            var i = c + r * ncols;
            if (i < input.length) {
                const filled = input[i] > 0.0;
                if (filled !== bit) {
                    result.push(count);
                    bit = !bit;
                    count = 1;
                }
                else
                    count++;
            }
        }
    }
    if (count > 0)
        result.push(count);
    return result;
}
/**
 * Converts RLE Array into SVG data as a single string.
 * @param {Float32Array<number>} rleMask
 * @param {number} height
 * @returns {string}
 */
export const traceRleToSVG = (rleMask, height) => {
    const polySegments = generatePolygonSegments(rleMask, height);
    const svgStr = convertSegmentsToSVG(polySegments);
    return svgStr;
};
export const getAllMasks = (maskData, height, width) => {
    let masks = [];
    for (let m = 0; m < 4; m++) {
        let nthMask = new Float32Array(height * width);
        const offset = m * width * height;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                var idx = i * width + j;
                if (idx < width * height) {
                    nthMask[idx] = maskData[offset + idx];
                }
            }
        }
        masks.push(nthMask);
    }
    return masks;
};
export const getBestPredMask = (maskData, height, width, index) => {
    let nthMask = new Float32Array(height * width);
    const offset = index * width * height;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var idx = i * width + j;
            if (idx < width * height) {
                nthMask[idx] = maskData[offset + idx];
            }
        }
    }
    const bestMask = new Tensor("float32", nthMask, [1, 1, width, height]);
    return bestMask;
};
function areaUnderLine(x0, y0, x1, y1) {
    // A vertical line has no area
    if (x0 === x1)
        return 0;
    // Square piece
    const ymin = Math.min(y0, y1);
    const squareArea = (x1 - x0) * ymin;
    // Triangle piece
    const ymax = Math.max(y0, y1);
    const triangleArea = Math.trunc((x1 - x0) * (ymax - ymin) / 2);
    return squareArea + triangleArea;
}
function svgCoordToInt(input) {
    if ((input.charAt(0) === "L") || (input.charAt(0) === "M")) {
        return parseInt(input.slice(1));
    }
    return parseInt(input);
}
function areaOfSVGPolygon(input) {
    let coords = input.split(" ");
    if (coords.length < 4)
        return 0;
    if (coords.length % 2 != 0)
        return 0;
    let area = 0;
    // We need to close the polygon loop, so start with the last coords.
    let old_x = svgCoordToInt(coords[coords.length - 2]);
    let old_y = svgCoordToInt(coords[coords.length - 1]);
    for (let i = 0; i < coords.length; i = i + 2) {
        let new_x = svgCoordToInt(coords[i]);
        let new_y = svgCoordToInt(coords[i + 1]);
        area = area + areaUnderLine(old_x, old_y, new_x, new_y);
        old_x = new_x;
        old_y = new_y;
    }
    return area;
}
/**
 * Filters SVG edges that enclose an area smaller than maxRegionSize.
 * Expects a list over SVG strings, with each string in the format:
 * 'M<x0> <y0> L<x1> <y1> <x2> <y2> ... <xn-1> <yn-1>'
 * The area calculation is not quite exact, truncating fractional pixels
 * instead of rounding. Both clockwise and counterclockwise SVG edges
 * are filtered, removing stray regions and small holes. Always keeps
 * at least one positive area region.
 */
export function filterSmallSVGRegions(input, maxRegionSize = 100) {
    const filtered_regions = input.filter((region) => Math.abs(areaOfSVGPolygon(region)) > maxRegionSize);
    if (filtered_regions.length === 0) {
        const areas = input.map((region) => areaOfSVGPolygon(region));
        const bestIdx = areas.indexOf(Math.max(...areas));
        return [input[bestIdx]];
    }
    return filtered_regions;
}
/**
 * Converts onnx model output into SVG data as a single string
 * @param {Float32Array<number>} maskData
 * @param {number} height
 * @param {number} width
 * @returns {string}
 */
export const traceOnnxMaskToSVG = (maskData, height, width) => {
    const rleMask = maskDataToFortranArrayToRle(maskData, width, height);
    let svgStr = traceRleToSVG(rleMask, width);
    svgStr = filterSmallSVGRegions(svgStr);
    return svgStr;
};
/**
 * Converts compressed RLE string into SVG
 * @param {string} maskString
 * @param {number} height
 * @returns {string}
 */
export const traceCompressedRLeStringToSVG = (maskString, height) => {
    const rleMask = rleFrString(maskString);
    let svgStr = traceRleToSVG(rleMask, height);
    svgStr = filterSmallSVGRegions(svgStr);
    return svgStr;
};
/**
 * Parses RLE from compressed string
 * @param {Array<number>} input
 * @returns array of integers
 */
export const rleFrString = (input) => {
    let result = [];
    let charIndex = 0;
    while (charIndex < input.length) {
        let value = 0, k = 0, more = 1;
        while (more) {
            let c = input.charCodeAt(charIndex) - 48;
            value |= (c & 0x1f) << (5 * k);
            more = c & 0x20;
            charIndex++;
            k++;
            if (!more && c & 0x10)
                value |= -1 << (5 * k);
        }
        if (result.length > 2)
            value += result[result.length - 2];
        result.push(value);
    }
    return result;
};
function toImageData(input, width, height) {
    const [r, g, b, a] = [0, 114, 189, 255];
    const arr = new Uint8ClampedArray(4 * width * height).fill(0);
    for (let i = 0; i < input.length; i++) {
        if (input[i] > 0.0) {
            arr[4 * i + 0] = r;
            arr[4 * i + 1] = g;
            arr[4 * i + 2] = b;
            arr[4 * i + 3] = a;
        }
    }
    return new ImageData(arr, height, width);
}
export function rleToImage(input, width, height) {
    return imageDataToImage(toImageData(input, width, height));
}
export function rleToCanvas(input, width, height) {
    return imageDataToCanvas(toImageData(input, width, height));
}
// Returns a boolean array for which masks to keep in the multi-mask
// display, given uncertain IoUs and overlap IoUs.
export function keepArrayForMultiMask(uncertainIoUs, overlapIoUs, uncertainThresh = 0.8, overlapThresh = 0.9) {
    let keepArray = uncertainIoUs.map((iou) => iou > uncertainThresh);
    const duplicateArray = overlapIoUs.map((iou) => iou < overlapThresh);
    keepArray = keepArray.map((val, i) => val && duplicateArray[i]);
    // If all masks fail tests, keep just the best one
    if (keepArray.every(item => item === false)) {
        const bestIdx = uncertainIoUs.indexOf(Math.max(...uncertainIoUs));
        keepArray[bestIdx] = true;
    }
    return keepArray;
}
//# sourceMappingURL=maskUtils.js.map