import { convertSegmentsToSVG, generatePolygonSegments } from "./trace";
const ort = require("onnxruntime-web");
export var clickType;
(function (clickType) {
    clickType[clickType["POSITIVE"] = 1] = "POSITIVE";
    clickType[clickType["NEGATIVE"] = 0] = "NEGATIVE";
    clickType[clickType["UPPER_LEFT"] = 2] = "UPPER_LEFT";
    clickType[clickType["BOTTOM_RIGHT"] = 3] = "BOTTOM_RIGHT";
})(clickType || (clickType = {}));
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
//# sourceMappingURL=Interfaces.js.map