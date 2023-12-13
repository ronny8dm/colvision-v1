const ort = require("onnxruntime-web");
import React, { useState } from "react";
import AppContext from "./createContext";
const AppContextProvider = (props) => {
    const [click, setClick] = useState(null);
    const [clicks, setClicks] = useState(null);
    const [clicksHistory, setClicksHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [prevImage, setPrevImage] = useState(null);
    const [isErasing, setIsErasing] = useState(false);
    const [isErased, setIsErased] = useState(false);
    const [error, setError] = useState(false);
    const [svg, setSVG] = useState(null);
    const [svgs, setSVGs] = useState(null);
    const [allsvg, setAllsvg] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState({ boxModel: false, allModel: false });
    const [stickers, setStickers] = useState([]);
    const [activeSticker, setActiveSticker] = useState(0);
    const [segmentTypes, setSegmentTypes] = useState("Click");
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [maskImg, setMaskImg] = useState(null);
    const [maskCanvas, setMaskCanvas] = useState(null);
    const [userNegClickBool, setUserNegClickBool] = useState(false);
    const [hasNegClicked, setHasNegClicked] = useState(false);
    const [stickerTabBool, setStickerTabBool] = useState(false);
    const [enableDemo, setEnableDemo] = useState(false);
    const [isMultiMaskMode, setIsMultiMaskMode] = useState(false);
    const [isHovering, setIsHovering] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [eraserText, setEraserText] = useState({ isErase: false, isEmbedding: false });
    const [didShowAMGAnimation, setDidShowAMGAnimation] = useState(false);
    const [predMask, setPredMask] = useState(null);
    const [predMasks, setPredMasks] = useState(null);
    const [predMasksHistory, setPredMasksHistory] = useState(null);
    const [isAllAnimationDone, setIsAllAnimationDone] = useState(false);
    const [isToolBarUpload, setIsToolBarUpload] = useState(false);
    return (React.createElement(AppContext.Provider, { value: {
            click: [click, setClick],
            clicks: [clicks, setClicks],
            clicksHistory: [clicksHistory, setClicksHistory],
            image: [image, setImage],
            prevImage: [prevImage, setPrevImage],
            error: [error, setError],
            svg: [svg, setSVG],
            svgs: [svgs, setSVGs],
            allsvg: [allsvg, setAllsvg],
            stickers: [stickers, setStickers],
            activeSticker: [activeSticker, setActiveSticker],
            isModelLoaded: [isModelLoaded, setIsModelLoaded],
            segmentTypes: [segmentTypes, setSegmentTypes],
            isLoading: [isLoading, setIsLoading],
            isErasing: [isErasing, setIsErasing],
            isErased: [isErased, setIsErased],
            canvasWidth: [canvasWidth, setCanvasWidth],
            canvasHeight: [canvasHeight, setCanvasHeight],
            maskImg: [maskImg, setMaskImg],
            maskCanvas: [maskCanvas, setMaskCanvas],
            userNegClickBool: [userNegClickBool, setUserNegClickBool],
            hasNegClicked: [hasNegClicked, setHasNegClicked],
            stickerTabBool: [stickerTabBool, setStickerTabBool],
            enableDemo: [enableDemo, setEnableDemo],
            isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
            isHovering: [isHovering, setIsHovering],
            showLoadingModal: [showLoadingModal, setShowLoadingModal],
            eraserText: [eraserText, setEraserText],
            didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation],
            predMask: [predMask, setPredMask],
            predMasks: [predMasks, setPredMasks],
            predMasksHistory: [predMasksHistory, setPredMasksHistory],
            isAllAnimationDone: [isAllAnimationDone, setIsAllAnimationDone],
            isToolBarUpload: [isToolBarUpload, setIsToolBarUpload],
        } }, props.children));
};
export default AppContextProvider;
//# sourceMappingURL=context.js.map