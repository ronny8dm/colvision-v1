// Colormap options copied from detectron2

const DETECTRON2_COLORS = [
    [0.0, 0.447, 0.741],
    [0.85, 0.325, 0.098],
    [0.929, 0.694, 0.125],
    [0.494, 0.184, 0.556],
    [0.466, 0.674, 0.188],
    [0.301, 0.745, 0.933],
    [0.635, 0.078, 0.184],
    [0.3, 0.3, 0.3],
    [0.6, 0.6, 0.6],
    [1.0, 0.0, 0.0],
    [1.0, 0.5, 0.0],
    [0.749, 0.749, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
    [0.667, 0.0, 1.0],
    [0.333, 0.333, 0.0],
    [0.333, 0.667, 0.0],
    [0.333, 1.0, 0.0],
    [0.667, 0.333, 0.0],
    [0.667, 0.667, 0.0],
    [0.667, 1.0, 0.0],
    [1.0, 0.333, 0.0],
    [1.0, 0.667, 0.0],
    [1.0, 1.0, 0.0],
    [0.0, 0.333, 0.5],
    [0.0, 0.667, 0.5],
    [0.0, 1.0, 0.5],
    [0.333, 0.0, 0.5],
    [0.333, 0.333, 0.5],
    [0.333, 0.667, 0.5],
    [0.333, 1.0, 0.5],
    [0.667, 0.0, 0.5],
    [0.667, 0.333, 0.5],
    [0.667, 0.667, 0.5],
    [0.667, 1.0, 0.5],
    [1.0, 0.0, 0.5],
    [1.0, 0.333, 0.5],
    [1.0, 0.667, 0.5],
    [1.0, 1.0, 0.5],
    [0.0, 0.333, 1.0],
    [0.0, 0.667, 1.0],
    [0.0, 1.0, 1.0],
    [0.333, 0.0, 1.0],
    [0.333, 0.333, 1.0],
    [0.333, 0.667, 1.0],
    [0.333, 1.0, 1.0],
    [0.667, 0.0, 1.0],
    [0.667, 0.333, 1.0],
    [0.667, 0.667, 1.0],
    [0.667, 1.0, 1.0],
    [1.0, 0.0, 1.0],
    [1.0, 0.333, 1.0],
    [1.0, 0.667, 1.0],
    [0.333, 0.0, 0.0],
    [0.5, 0.0, 0.0],
    [0.667, 0.0, 0.0],
    [0.833, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 0.167, 0.0],
    [0.0, 0.333, 0.0],
    [0.0, 0.5, 0.0],
    [0.0, 0.667, 0.0],
    [0.0, 0.833, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 0.167],
    [0.0, 0.0, 0.333],
    [0.0, 0.0, 0.5],
    [0.0, 0.0, 0.667],
    [0.0, 0.0, 0.833],
    [0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0],
    [0.143, 0.143, 0.143],
    [0.857, 0.857, 0.857],
    [1.0, 1.0, 1.0],
];

const Colors = (function () {
    const RGBs: Array<string> = [];
    DETECTRON2_COLORS.map((color) => {
        const [r, g, b] = color.map((n) => {
            return Math.round(n * 255);
        });
        RGBs.push(`rgb(${r},${g},${b})`);
    });
    return RGBs;
})();

export default Colors;