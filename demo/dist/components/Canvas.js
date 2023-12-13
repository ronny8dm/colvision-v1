import Konva from "konva";
import React, { useContext, useEffect, useRef, useState, } from "react";
import { RadialProgress } from "react-daisyui";
import { Circle, Image, Layer, Path, Rect, Ring, Stage } from "react-konva";
import { canvasScaleInitializer, canvasScaleResizer, } from "./helpers/CanvasHelper";
import Colors from "./helpers/Colors";
import AppContext from "./hooks/createContext";
import SvgMask from "./SvgMask";
// The line below is part of the fix for the iOS canvas area limit of 16777216
Konva.pixelRatio = 1;
const Canvas = ({ konvaRef, handleMouseUp, scale, handleMouseDown, handleMouseMove, handleMouseOut, annotations, newAnnotation, containerRef, hasClicked, setCanvasScale, isStandalone, isHoverToolTip: [isHoverToolTip, setIsHoverToolTip], allText: [allText, setAllText], }) => {
    const { click: [click, setClick], clicks: [clicks, setClicks], image: [image], svg: [svg], svgs: [svgs], allsvg: [allsvg], segmentTypes: [segmentTypes, setSegmentTypes], isErased: [isErased], isErasing: [isErasing], isLoading: [isLoading, setIsLoading], canvasWidth: [, setCanvasWidth], canvasHeight: [, setCanvasHeight], maskImg: [maskImg], stickerTabBool: [stickerTabBool, setStickerTabBool], isModelLoaded: [isModelLoaded, setIsModelLoaded], isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode], isHovering: [isHovering, setIsHovering], didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation], isAllAnimationDone: [isAllAnimationDone, setIsAllAnimationDone], } = useContext(AppContext);
    // if (!image) return null;
    const MAX_CANVAS_AREA = 1677721;
    const w = scale.width;
    const h = scale.height;
    const area = w * h;
    const canvasScale = area > MAX_CANVAS_AREA ? Math.sqrt(MAX_CANVAS_AREA / (w * h)) : 1;
    const canvasDimensions = {
        width: Math.floor(w * canvasScale),
        height: Math.floor(h * canvasScale),
    };
    const imageClone = new window.Image();
    const init_imageClone = () => {
        if (!image)
            return null;
        imageClone.src = image.src;
        imageClone.width = w;
        imageClone.height = h;
    };
    init_imageClone();
    const resizer = canvasScaleInitializer({
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        containerRef,
        shouldFitToWidth: isStandalone,
    });
    const [scalingStyle, setScalingStyle] = useState(resizer.scalingStyle);
    const [scaledDimensionsStyle, setScaledDimensionsStyle] = useState(resizer.scaledDimensionsStyle);
    const [shouldShowAnimation, setShouldShowAnimation] = useState(null);
    const [hasTouchMoved, setHasTouchMoved] = useState(false);
    const [numOfTouches, setNumOfTouches] = useState(0);
    const scrollRef = useRef(null);
    const [allTimeouts, setAllTimeouts] = useState([]);
    const [shouldAllAnimate, setShouldAllAnimate] = useState(false);
    const shouldAllAnimateRef = useRef(false);
    const annotationsToDraw = [...annotations, ...newAnnotation];
    const positiveClickColor = "turquoise";
    const negativeClickColor = "pink";
    const handleClickColor = (num) => {
        switch (num) {
            case 0:
                return negativeClickColor;
            case 1:
                return positiveClickColor;
            default:
                return null;
        }
    };
    const clickColor = click ? handleClickColor(click.clickType) : null;
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.target === containerRef.current) {
                let width;
                let height;
                if (entry.contentBoxSize) {
                    // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                    const contentBoxSize = Array.isArray(entry.contentBoxSize)
                        ? entry.contentBoxSize[0]
                        : entry.contentBoxSize;
                    width = contentBoxSize.inlineSize;
                    height = contentBoxSize.blockSize;
                }
                else {
                    width = entry.contentRect.width;
                    height = entry.contentRect.height;
                }
                const resized = canvasScaleResizer({
                    width: canvasDimensions.width,
                    height: canvasDimensions.height,
                    containerWidth: width,
                    containerHeight: height,
                    shouldFitToWidth: isStandalone,
                });
                setCanvasWidth(resized.scaledWidth);
                setCanvasHeight(resized.scaledHeight);
                setScaledDimensionsStyle(resized.scaledDimensionsStyle);
                setScalingStyle(resized.scalingStyle);
            }
        }
    });
    useEffect(() => {
        if (segmentTypes === "All") {
            shouldAllAnimateRef.current = true;
            setShouldAllAnimate(true);
        }
        else {
            shouldAllAnimateRef.current = false;
            setShouldAllAnimate(false);
            allTimeouts.forEach((allTimeout) => clearTimeout(allTimeout));
            setAllTimeouts([]);
            if (konvaRef === null)
                return;
            const animateAllSvg = konvaRef.current.findOne(".animateAllSvg");
            animateAllSvg.destroyChildren();
            animateAllSvg.draw();
        }
    }, [segmentTypes]);
    const animateAllSvg = () => {
        if (didShowAMGAnimation)
            return;
        if (konvaRef === null)
            return;
        if (konvaRef.current === null)
            return;
        setIsAllAnimationDone(false);
        const animateAllSvg = konvaRef.current.findOne(".animateAllSvg");
        animateAllSvg.find("Circle").forEach((el) => el.destroy());
        animateAllSvg.find("Path").forEach((el) => el.destroy());
        const width = canvasDimensions.width / 32;
        const height = canvasDimensions.height / 32;
        const minRadius = 1.5;
        const radius = Math.max(minRadius, (2.5 * canvasScale) / scale.uploadScale);
        const bigRadius = 2 * radius;
        const timer = (ms) => new Promise((res, rej) => setTimeout(() => {
            if (shouldAllAnimate && shouldAllAnimateRef.current) {
                res();
            }
            else {
                rej();
            }
        }, ms));
        const drawSpinner = async () => {
            try {
                setAllText("Prompting SAM with each point in the grid");
                for (let i = 0; i <= 32; i++) {
                    await timer(50);
                    for (let j = 0; j <= 32; j++) {
                        const circle = new Konva.Circle({
                            x: width * (i + 0.5),
                            y: height * (j + 0.5),
                            radius: radius,
                            fill: "white",
                            perfectDrawEnabled: false,
                            opacity: 0,
                        });
                        animateAllSvg.add(circle);
                        circle.to({
                            opacity: 1,
                            duration: 1,
                            easing: Konva.Easings.EaseInOut,
                        });
                        const newAllTimeout = setTimeout(() => {
                            circle.to({
                                opacity: 0,
                                duration: 1,
                                easing: Konva.Easings.EaseInOut,
                            });
                        }, 2700);
                        setAllTimeouts((prev) => [...prev, newAllTimeout]);
                    }
                }
            }
            catch (error) {
                console.log("Rejected");
            }
        };
        drawSpinner();
        const load = async () => {
            try {
                setDidShowAMGAnimation(true);
                await timer(2300);
                setAllText("Final points after de-duplicating predicted masks");
                if (!allsvg || !scale)
                    return;
                allsvg.map(async ({ svg, point_coord }, i) => {
                    const circle = new Konva.Circle({
                        x: point_coord[0] * (canvasScale / scale.uploadScale),
                        y: point_coord[1] * (canvasScale / scale.uploadScale),
                        radius: radius,
                        fill: "white",
                        perfectDrawEnabled: false,
                    });
                    const path = new Konva.Path({
                        key: i,
                        data: svg.join(" "),
                        fill: Colors[i % Colors.length],
                        stroke: "blue",
                        strokeWidth: 3,
                        scaleX: canvasScale / scale.uploadScale,
                        scaleY: canvasScale / scale.uploadScale,
                        opacity: 0,
                        lineCap: "round",
                        lineJoin: "round",
                        preventDefault: false,
                        perfectDrawEnabled: false,
                    });
                    animateAllSvg.add(path);
                    animateAllSvg.add(circle);
                    animateAllSvg.draw();
                    circle.to({
                        duration: 1,
                        radius: bigRadius,
                        easing: Konva.Easings.EaseInOut,
                    });
                    const newAllTimeout1 = setTimeout(() => {
                        path.to({
                            opacity: 0.4,
                            duration: 1,
                            easing: Konva.Easings.EaseInOut,
                        });
                    }, 2600);
                    const newAllTimeout2 = setTimeout(() => {
                        setAllText("All of the predicted masks");
                        circle.to({
                            duration: 1,
                            opacity: 0,
                            easing: Konva.Easings.EaseInOut,
                        });
                    }, 3500);
                    const newAllTimeout3 = setTimeout(() => {
                        setIsAllAnimationDone(true);
                        setAllText(React.createElement("span", null,
                            "Interested in learning more? Check out the",
                            " ",
                            React.createElement("a", { href: "https://ai.facebook.com/research/publications/segment-anything/", target: "_blank", className: "underline" }, "Paper"),
                            ",",
                            " ",
                            React.createElement("a", { href: "https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/", target: "_blank", className: "underline" }, "Blog Post"),
                            ", or",
                            " ",
                            React.createElement("a", { href: "https://github.com/facebookresearch/segment-anything", target: "_blank", className: "underline" }, "Code"),
                            "."));
                    }, 5000);
                    setAllTimeouts((prev) => [
                        ...prev,
                        newAllTimeout1,
                        newAllTimeout2,
                        newAllTimeout3,
                    ]);
                });
            }
            catch (error) {
                console.log("Rejected");
            }
        };
        load();
    };
    useEffect(() => {
        setCanvasScale(canvasScale);
        setCanvasWidth(resizer.scaledWidth);
        setCanvasHeight(resizer.scaledHeight);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);
    const superDefer = (cb) => {
        setTimeout(() => window.requestAnimationFrame(() => {
            setTimeout(() => {
                cb();
            }, 0);
        }), 0);
    };
    useEffect(() => {
        let newClicks = null;
        if (clicks && click) {
            newClicks = [...clicks, click];
        }
        else if (click) {
            newClicks = [click];
        }
        if (newClicks) {
            superDefer(() => superDefer(() => setClicks(newClicks)));
        }
    }, [click]);
    useEffect(() => {
        const padding = isStandalone ? 0 : 144; // pt-36 = 36rem = 144px
        const el = scrollRef.current;
        if (el) {
            const maxScrollLeft = resizer.scaledWidth - resizer.containerWidth;
            const maxScrollTop = resizer.scaledHeight - resizer.containerHeight;
            el.scrollLeft = maxScrollLeft / 2;
            el.scrollTop = padding - (maxScrollTop - padding) / 2;
        }
    }, [scalingStyle]);
    useEffect(() => {
        if (isHovering && clicks && clicks.length == 1) {
            setShouldShowAnimation(true);
        }
        else {
            setShouldShowAnimation(false);
        }
    }, [clicks, isHovering]);
    const shouldShowSpinner = (segmentTypes === "All" && isLoading) ||
        (isLoading && !hasClicked && !isModelLoaded.boxModel) ||
        (isLoading && isErasing);
    return (React.createElement(React.Fragment, null,
        shouldShowSpinner && (React.createElement("div", { className: `absolute z-10 flex items-center justify-center w-full h-full md:hidden` },
            React.createElement(RadialProgress, { className: "animate-spin", size: 0.3 * Math.min(resizer.scaledWidth, resizer.scaledHeight) + "px", thickness: "1rem", value: 70 }))),
        React.createElement("div", { className: `absolute w-full h-full overflow-auto Canvas-wrapper md:overflow-visible md:w-auto md:h-auto absolute-center ${!isStandalone ? "pt-36 md:pt-0" : ""}`, ref: scrollRef },
            React.createElement("div", { onMouseOver: () => {
                    setIsHoverToolTip(true);
                    if (segmentTypes === "Click" && isMultiMaskMode) {
                        setIsHovering(true);
                    }
                }, onMouseOut: () => {
                    setIsHoverToolTip(false);
                    if (segmentTypes === "Click" &&
                        isMultiMaskMode &&
                        clicks !== null &&
                        clicks.length === 1) {
                        setIsHovering(false);
                    }
                }, className: `Canvas relative ${isLoading ? "pointer-events-none" : ""} ${shouldShowAnimation
                    ? "rotate"
                    : isHovering === false
                        ? "unrotate"
                        : ""} ${isMultiMaskMode ? "multi-mask-mode" : ""}`, style: scaledDimensionsStyle },
                React.createElement("div", { className: "absolute w-full h-full bg-black pointer-events-none background" }),
                React.createElement("img", { src: image?.src, className: `absolute w-full h-full pointer-events-none ${isLoading ||
                        (hasClicked && !isMultiMaskMode) ||
                        (isMultiMaskMode && clicks)
                        ? "opacity-50"
                        : ""}`, style: { margin: 0 } }),
                segmentTypes !== "All" &&
                    svg &&
                    svgs &&
                    scale &&
                    hasClicked &&
                    isMultiMaskMode &&
                    svgs
                        .map((svg, i) => (React.createElement(SvgMask, { key: i, id: `${i}`, className: `mask-${i + 1}-of-${svgs.length}`, xScale: scale.width * scale.uploadScale, yScale: scale.height * scale.uploadScale, svgStr: svg.join(" ") })))
                        .concat(React.createElement(SvgMask, { className: `mask-best`, xScale: scale.width * scale.uploadScale, yScale: scale.height * scale.uploadScale, svgStr: svg.join(" ") })),
                segmentTypes !== "All" &&
                    svg &&
                    scale &&
                    hasClicked &&
                    !isMultiMaskMode && (React.createElement(SvgMask, { xScale: scale.width * scale.uploadScale, yScale: scale.height * scale.uploadScale, svgStr: svg.join(" ") })),
                React.createElement(Stage, { className: "konva", width: canvasDimensions.width, height: canvasDimensions.height, onMouseDown: (e) => {
                        if (stickerTabBool)
                            return;
                        handleMouseDown(e);
                    }, onMouseUp: (e) => {
                        if (stickerTabBool) {
                            setStickerTabBool(false);
                            return;
                        }
                        if (segmentTypes === "All")
                            return;
                        if (isMultiMaskMode && clicks)
                            return;
                        setIsLoading(true);
                        handleMouseUp(e);
                    }, onMouseMove: handleMouseMove, onMouseOut: handleMouseOut, onMouseLeave: handleMouseOut, onTouchStart: (e) => {
                        if (stickerTabBool)
                            return;
                        handleMouseDown(e);
                        setNumOfTouches((prev) => {
                            return prev + 1;
                        });
                    }, onTouchEnd: (e) => {
                        if (stickerTabBool)
                            return;
                        if (segmentTypes !== "All" &&
                            !hasTouchMoved &&
                            numOfTouches === 1) {
                            setIsLoading(true);
                            superDefer(() => superDefer(() => handleMouseUp(e, true)));
                        }
                        setHasTouchMoved(false);
                        setNumOfTouches(0);
                    }, onTouchMove: () => {
                        setHasTouchMoved(true);
                    }, onContextMenu: (e) => e.evt.preventDefault(), ref: konvaRef, style: scalingStyle },
                    React.createElement(Layer, { name: "svgMask" },
                        React.createElement(Image, { x: 0, y: 0, image: imageClone, width: canvasDimensions.width, height: canvasDimensions.height, opacity: 0, preventDefault: false }),
                        segmentTypes !== "All"
                            ? svg &&
                                scale &&
                                hasClicked && (React.createElement(Path, { data: svg.join(" "), fill: "black", scaleX: canvasScale / scale.uploadScale, scaleY: canvasScale / scale.uploadScale, lineCap: "round", lineJoin: "round", opacity: 0, preventDefault: false }))
                            : allsvg &&
                                scale &&
                                allsvg.map(({ point_coord, svg }, i) => (React.createElement(Path, { key: i, data: svg.join(" "), fill: Colors[i % Colors.length], stroke: "blue", strokeWidth: 3, scaleX: canvasScale / scale.uploadScale, scaleY: canvasScale / scale.uploadScale, opacity: 0.5, lineCap: "round", lineJoin: "round", preventDefault: false, visible: false })))),
                    React.createElement(Layer, { name: "animateAllSvg" }, segmentTypes === "All" && shouldAllAnimate && animateAllSvg()),
                    React.createElement(Layer, { name: "annotations" },
                        clicks &&
                            hasClicked &&
                            clicks.map((click, idx) => {
                                const clickColor = handleClickColor(click.clickType);
                                return (clickColor && (React.createElement(Circle, { key: idx, id: `${idx}`, x: (click.x * canvasScale) / scale.scale, y: (click.y * canvasScale) / scale.scale, fill: clickColor, radius: (5 * canvasScale) / scale.scale, shadowBlur: 5, shadowColor: clickColor === positiveClickColor
                                        ? "black"
                                        : clickColor, preventDefault: false })));
                            }),
                        click && clickColor && (React.createElement(React.Fragment, null,
                            React.createElement(Circle, { x: (click.x * canvasScale) / scale.scale, y: (click.y * canvasScale) / scale.scale, fill: clickColor, shadowColor: clickColor === positiveClickColor
                                    ? "black"
                                    : negativeClickColor, shadowBlur: 5, preventDefault: false, radius: (5 * canvasScale) / scale.scale }),
                            React.createElement(Ring, { x: (click.x * canvasScale) / scale.scale, y: (click.y * canvasScale) / scale.scale, fill: clickColor, shadowColor: clickColor === positiveClickColor
                                    ? "black"
                                    : negativeClickColor, shadowBlur: 5, preventDefault: false, radius: (55 * canvasScale) / scale.scale, innerRadius: (50 * canvasScale) / scale.scale, outerRadius: (60 * canvasScale) / scale.scale }))),
                        !isErased &&
                            annotationsToDraw.map((value, i) => {
                                return (React.createElement(Rect, { key: i, x: value.x, y: value.y, width: value.width, height: value.height, fill: "transparent", stroke: "white", strokeWidth: 1.5, preventDefault: false }));
                            }))),
                segmentTypes !== "All" && maskImg && !hasClicked && (React.createElement("img", { src: maskImg?.src, style: { margin: 0 }, className: `absolute top-0 opacity-40 pointer-events-none w-full h-full` })),
                shouldShowSpinner && (React.createElement("div", { className: `hidden absolute z-10 md:flex items-center justify-center w-full h-full top-0` },
                    React.createElement(RadialProgress, { className: "animate-spin", size: 0.3 * Math.min(resizer.scaledWidth, resizer.scaledHeight) +
                            "px", thickness: "1rem", value: 70 })))))));
};
export default Canvas;
//# sourceMappingURL=Canvas.js.map