import React, { useContext, useState } from "react";
import { getCookieConsentValue } from "react-cookie-consent";
import { useDropzone } from "react-dropzone";
import * as ReactGA from "react-ga4";
import Animate from "./hooks/Animation";
import AppContext from "./hooks/createContext";
import SegmentOptions from "./SegmentOptions";
const SegmentDrawer = ({ handleResetState, handleResetInteraction, handleUndoInteraction, handleRedoInteraction, handleCreateSticker, handleMagicErase, handleImage, handleMultiMaskMode, userNegClickBool: [userNegClickBool, setUserNegClickBool], showGallery: [showGallery, setShowGallery], hasClicked, handleSelectedImage, }) => {
    const { isModelLoaded: [isModelLoaded, setIsModelLoaded], segmentTypes: [segmentTypes, setSegmentTypes], isLoading: [isLoading, setIsLoading], isErased: [isErased, setIsErased], isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode], stickers: [stickers, setStickers], activeSticker: [activeSticker, setActiveSticker], didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation], isAllAnimationDone: [isAllAnimationDone, setIsAllAnimationDone], isToolBarUpload: [isToolBarUpload, setIsToolBarUpload], } = useContext(AppContext);
    const [uploadClick, setUploadClick] = useState(true);
    const [visibleClickHover, setVisibleClickHover] = useState(false);
    const [visibleBoxHover, setVisibleBoxHover] = useState(false);
    const [visibleAllHover, setVisibleAllHover] = useState(false);
    const [visibleStickerHover, setVisibleStickerHover] = useState(false);
    const [isCutOut, setIsCutOut] = useState(false);
    const handleStickerClick = (i) => {
        setActiveSticker(i);
    };
    const [error, setError] = useState("");
    const [isClickCollapsed, setIsClickCollapsed] = useState(true);
    const [isBoxCollapsed, setIsBoxCollapsed] = useState(true);
    const [isAllCollapsed, setIsAllCollapsed] = useState(true);
    const [isCutOutCollapsed, setIsCutOutCollapsed] = useState(true);
    const [isClickMounted, setIsClickMounted] = useState(false);
    const [isBoxMounted, setIsBoxMounted] = useState(false);
    const [isAllMounted, setIsAllMounted] = useState(false);
    const [isCutOutMounted, setIsCutOutMounted] = useState(false);
    let clickTimeout, boxTimeout, allTimeout, cutOutTimeout;
    // setIsClickMounted(false)
    // setIsBoxMounted(false)
    // setIsAllMounted(false)
    // setIsCutOutMounted(false)
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
        },
        onDrop: (acceptedFile) => {
            try {
                if (acceptedFile.length === 0) {
                    setError("File not accepted! Try again.");
                    return;
                }
                if (acceptedFile.length > 1) {
                    setError("Too many files! Try again with 1 file.");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleSelectedImage(acceptedFile[0]);
                };
                reader.readAsDataURL(acceptedFile[0]);
            }
            catch (error) {
                console.log(error);
            }
        },
        maxSize: 50_000_000,
    });
    console.log(isModelLoaded["allModel"]);
    return (React.createElement("section", { className: "flex-col hidden w-1/5 pt-[6%] overflow-y-auto md:flex lg:w-72" },
        React.createElement("div", { className: `shadow-[0px_0px_15px_5px_#00000024] rounded-xl md:mx-1 lg:mx-5` },
            React.createElement("div", { className: "p-4 pt-5" },
                React.createElement("div", { className: "flex justify-between p-2 pb-3" },
                    React.createElement("span", { className: "leading-3" }, "Tools")),
                uploadClick && (React.createElement("div", { className: "flex justify-between px-3 py-2 mb-3 cursor-pointer rounded-xl outline outline-gray-200" },
                    React.createElement("button", { className: "flex", onClick: () => {
                            setIsToolBarUpload(false);
                            setShowGallery(false);
                            setIsCutOut(false);
                            setDidShowAMGAnimation(false);
                            handleResetState();
                        } },
                        React.createElement("img", { src: "assets/icn-image-gallery.svg", className: "w-5 mr-1" }),
                        React.createElement("span", { className: "text-sm" }, "Gallery")))),
                React.createElement("div", { onClick: () => {
                        segmentTypes !== "Click" && handleResetInteraction();
                        getCookieConsentValue("sa_demo") === "true" &&
                            ReactGA.default.send({
                                category: "event",
                                action: "is_click",
                            });
                        clearTimeout(clickTimeout);
                        setSegmentTypes("Click");
                        setIsCutOut(false);
                        setDidShowAMGAnimation(false);
                    }, className: `transition-all overflow-hidden pb-2 ${segmentTypes !== "Click" &&
                        (isClickCollapsed ? "max-h-[40px]" : "max-h-[85px]")} px-3 py-2 cursor-pointer rounded-xl ${segmentTypes === "Click"
                        ? "outline-blue-700 outline outline-[2.5px]"
                        : "outline outline-gray-200 "} ${isCutOut && "hidden"}`, onMouseEnter: () => {
                        clearTimeout(clickTimeout);
                        clickTimeout = setTimeout(() => {
                            setIsClickCollapsed(false);
                            setVisibleClickHover(true);
                            setIsClickMounted(!isClickMounted);
                        }, 700);
                    }, onMouseLeave: () => {
                        setIsClickCollapsed(true);
                        setIsBoxCollapsed(true);
                        setIsAllCollapsed(true);
                        setIsCutOutCollapsed(true);
                        // setVisibleClickHover(false);
                        clearTimeout(clickTimeout);
                        setIsClickMounted(false);
                        setIsBoxMounted(false);
                        setIsAllMounted(false);
                        setIsCutOutMounted(false);
                    } },
                    React.createElement("div", { className: "flex" },
                        React.createElement("svg", { width: "17", height: "24", viewBox: "0 0 17 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "w-3 mr-2" },
                            React.createElement("path", { d: "M9.13635 23.8813C8.53843 24.1683 7.82091 23.9172 7.54586 23.3192L4.93889 17.6509L1.93729 20.0665C1.73399 20.2339 1.48286 20.3296 1.19586 20.3296C0.878697 20.3296 0.574526 20.2036 0.350259 19.9793C0.125992 19.7551 0 19.4509 0 19.1337V1.19586C0 0.878697 0.125992 0.574526 0.350259 0.350259C0.574526 0.125992 0.878697 0 1.19586 0C1.48286 0 1.75791 0.107627 1.96121 0.275047L1.97317 0.263089L15.7136 11.7912C16.2278 12.2217 16.2876 12.9751 15.869 13.4773C15.6897 13.6926 15.4385 13.8361 15.1874 13.8839L11.4085 14.6253L14.0394 20.2817C14.3503 20.8797 14.0633 21.5852 13.4654 21.8603L9.13635 23.8813Z", fill: `${segmentTypes === "Click" ? "#2962D9" : "#000000"}` })),
                        React.createElement("span", { className: `font-bold ${segmentTypes === "Click" && "text-blue-600"}` }, "Hover & Click")),
                    segmentTypes !== "Click" && visibleClickHover && (React.createElement(Animate, { isMounted: isClickMounted },
                        React.createElement("p", { className: "my-3 text-[11px] opacity-70" }, "Click an object one or more times. Shift-click to remove regions."))),
                    segmentTypes === "Click" && (React.createElement("p", { className: `my-3 text-[11px] text-blue-700 opacity-70` }, "Click an object one or more times. Shift-click to remove regions.")),
                    React.createElement("div", { className: "flex justify-between mx-5 my-3" },
                        React.createElement("div", { onClick: () => setUserNegClickBool(false), className: "flex flex-col items-center" },
                            React.createElement("p", { className: `w-8 h-7 text-3xl leading-7 text-center align-middle rounded-lg mb-1 ${userNegClickBool
                                    ? "outline outline-1"
                                    : "bg-blue-600 text-white"}` }, "+"),
                            React.createElement("p", { className: `text-xs font-bold ${!userNegClickBool && "text-blue-600"}` }, "Add Mask")),
                        React.createElement("div", { onClick: () => setUserNegClickBool(true), className: `flex flex-col items-center ${!hasClicked ? "disabled" : ""}` },
                            React.createElement("p", { className: `w-8 h-7 text-3xl leading-6 text-center align-middle rounded-lg mb-1 ${userNegClickBool
                                    ? "bg-blue-600 text-white"
                                    : "outline outline-1"}` }, "-"),
                            React.createElement("p", { className: `text-xs font-bold ${userNegClickBool && "text-blue-600"}` }, "Remove Area"))),
                    segmentTypes === "Click" && (React.createElement(SegmentOptions, { handleResetInteraction: handleResetInteraction, handleUndoInteraction: handleUndoInteraction, handleRedoInteraction: handleRedoInteraction, handleCreateSticker: handleCreateSticker, handleMagicErase: handleMagicErase, handleImage: handleImage, hasClicked: hasClicked, isCutOut: [isCutOut, setIsCutOut], handleMultiMaskMode: handleMultiMaskMode }))),
                React.createElement("div", { onClick: () => {
                        segmentTypes !== "Box" && handleResetInteraction(true);
                        ReactGA.default.send({
                            category: "event",
                            action: "is_box",
                        });
                        clearTimeout(boxTimeout);
                        setIsMultiMaskMode(false);
                        setSegmentTypes("Box");
                        setIsCutOut(false);
                        setDidShowAMGAnimation(false);
                    }, className: `transition-all overflow-hidden ${segmentTypes !== "Box" &&
                        (isBoxCollapsed ? "max-h-[40px]" : "max-h-[85px]")} my-2 rounded-xl px-4 py-2 cursor-pointer ${segmentTypes === "Box"
                        ? "outline-blue-700 outline outline-[2.5px]"
                        : "outline outline-gray-200"} ${isCutOut && "hidden"}`, onMouseEnter: () => {
                        clearTimeout(boxTimeout);
                        boxTimeout = setTimeout(() => {
                            setIsBoxCollapsed(false);
                            setVisibleBoxHover(true);
                            setIsBoxMounted(true);
                        }, 700);
                    }, onMouseLeave: () => {
                        setIsClickCollapsed(true);
                        setIsBoxCollapsed(true);
                        setIsAllCollapsed(true);
                        setIsCutOutCollapsed(true);
                        setVisibleBoxHover(false);
                        clearTimeout(boxTimeout);
                        setIsClickMounted(false);
                        setIsBoxMounted(false);
                        setIsAllMounted(false);
                        setIsCutOutMounted(false);
                    } },
                    React.createElement("div", { className: "flex" },
                        React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                            React.createElement("path", { d: "M17.7778 0H2.22222C1.63285 0 1.06762 0.234126 0.650874 0.650874C0.234126 1.06762 0 1.63285 0 2.22222V17.7778C0 18.3671 0.234126 18.9324 0.650874 19.3491C1.06762 19.7659 1.63285 20 2.22222 20H17.7778C18.3671 20 18.9324 19.7659 19.3491 19.3491C19.7659 18.9324 20 18.3671 20 17.7778V2.22222C20 1.63285 19.7659 1.06762 19.3491 0.650874C18.9324 0.234126 18.3671 0 17.7778 0ZM17.7778 17.7778H2.22222V2.22222H17.7778V17.7778ZM15.5556 15.5556H4.44444V4.44444H15.5556V15.5556Z", fill: `${segmentTypes === "Box" ? "#2962D9" : "#000000"}` })),
                        React.createElement("span", { className: `pl-2 font-bold ${segmentTypes === "Box" && "text-blue-600"}` }, "Box")),
                    segmentTypes !== "Box" && visibleBoxHover && (React.createElement(Animate, { isMounted: isBoxMounted },
                        React.createElement("p", { className: "my-3 text-xs opacity-70" }, "Roughly draw a box around an object."))),
                    segmentTypes === "Box" && (React.createElement("p", { className: `my-3 text-xs text-blue-700 opacity-70` }, "Roughly draw a box around an object.")),
                    React.createElement("div", { className: "flex justify-between mx-5 my-3" },
                        React.createElement("div", { onClick: () => setUserNegClickBool(false), className: "flex flex-col items-center" },
                            React.createElement("p", { className: `w-8 h-7 text-3xl leading-7 text-center align-middle rounded-lg mb-1 ${userNegClickBool
                                    ? "outline outline-1"
                                    : "bg-blue-600 text-white"}` }, "+"),
                            React.createElement("p", { className: `text-xs font-bold ${!userNegClickBool && "text-blue-600"}` }, "Add Mask")),
                        React.createElement("div", { onClick: () => setUserNegClickBool(true), className: `flex flex-col items-center ${!hasClicked ? "disabled" : ""}` },
                            React.createElement("p", { className: `w-8 h-7 text-3xl leading-6 text-center align-middle rounded-lg mb-1 ${userNegClickBool
                                    ? "bg-blue-600 text-white"
                                    : "outline outline-1"}` }, "-"),
                            React.createElement("p", { className: `text-xs font-bold ${userNegClickBool && "text-blue-600"}` }, "Remove Area"))),
                    segmentTypes === "Box" && (React.createElement(SegmentOptions, { handleResetInteraction: handleResetInteraction, handleUndoInteraction: handleUndoInteraction, handleRedoInteraction: handleRedoInteraction, handleCreateSticker: handleCreateSticker, handleMagicErase: handleMagicErase, handleImage: handleImage, hasClicked: hasClicked, isCutOut: [isCutOut, setIsCutOut], handleMultiMaskMode: handleMultiMaskMode }))),
                React.createElement("div", { onClick: (e) => {
                        clearTimeout(cutOutTimeout);
                        setIsMultiMaskMode(false);
                        setIsCutOut(true);
                        setUploadClick(false);
                        getCookieConsentValue("sa_demo") === "true" &&
                            ReactGA.default.send({
                                category: "event",
                                action: "is_cutout",
                            });
                    }, className: `transition-all overflow-hidden my-2 rounded-xl px-4 py-2 cursor-pointer ${isCutOut
                        ? "outline-blue-700 outline outline-[2.5px]"
                        : "outline outline-gray-200"}`, onMouseEnter: () => {
                        clearTimeout(cutOutTimeout);
                        cutOutTimeout = setTimeout(() => {
                            setIsCutOutCollapsed(false);
                            setVisibleStickerHover(true);
                            setIsCutOutMounted(true);
                        }, 700);
                    }, onMouseLeave: () => {
                        setIsClickCollapsed(true);
                        setIsBoxCollapsed(true);
                        setIsAllCollapsed(true);
                        setIsCutOutCollapsed(true);
                        clearTimeout(cutOutTimeout);
                        // setVisibleStickerHover(false);
                        setIsClickMounted(false);
                        setIsBoxMounted(false);
                        setIsAllMounted(false);
                        setIsCutOutMounted(false);
                    } },
                    React.createElement("div", { className: `flex ${isCutOut === false &&
                            (isCutOutCollapsed ? "max-h-[40px]" : "max-h-[2048px]")}` },
                        React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", className: "mt-1" },
                            React.createElement("path", { d: "M10.575 6.3C10.575 5.175 11.0812 4.5 11.925 4.5C12.7687 4.5 13.275 5.175 13.275 6.3C13.275 7.425 12.7687 8.1 11.925 8.1C11.0812 8.1 10.575 7.425 10.575 6.3Z", fill: `${isCutOut ? "#2962D9" : "#000000"}` }),
                            React.createElement("path", { d: "M6.075 4.5C5.23125 4.5 4.725 5.175 4.725 6.3C4.725 7.425 5.23125 8.1 6.075 8.1C6.91875 8.1 7.425 7.425 7.425 6.3C7.425 5.175 6.91875 4.5 6.075 4.5Z", fill: `${isCutOut ? "#2962D9" : "#000000"}` }),
                            React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 10.2088V3.6C18 1.61177 16.3882 0 14.4 0H3.6C1.61177 0 0 1.61177 0 3.6V14.4C0 16.3882 1.61177 18 3.6 18H10.2088C11.1636 18 12.0793 17.6207 12.7544 16.9456L16.9456 12.7544C17.6207 12.0793 18 11.1636 18 10.2088ZM3.6 2.25H14.4C15.1456 2.25 15.75 2.85442 15.75 3.6V8.75C15.75 8.88807 15.6381 9 15.5 9H12.6C10.8656 9 9.4177 10.2265 9.07625 11.8594C9.06866 11.8957 9.03707 11.9225 8.99998 11.9225C7.65188 11.9225 6.41916 11.4285 5.47297 10.6116C5.07293 10.2662 4.45995 10.2265 4.08625 10.6001C3.75946 10.9269 3.73435 11.4546 4.07118 11.771C5.3028 12.928 6.94175 13.6565 8.74991 13.7182C8.8879 13.7229 8.99998 13.8344 8.99998 13.9725L9 15.5C9 15.6381 8.88807 15.75 8.75 15.75H3.6C2.85442 15.75 2.25 15.1456 2.25 14.4V3.6C2.25 2.85442 2.85442 2.25 3.6 2.25Z", fill: `${isCutOut ? "#2962D9" : "#000000"}` })),
                        React.createElement("span", { className: `pl-2 font-bold ${isCutOut && "text-blue-600"}` }, "Cut-Outs"),
                        isCutOut && (React.createElement("button", { className: "ml-auto font-bold", onClick: (e) => {
                                e.stopPropagation();
                                setIsCutOut(false);
                                setSegmentTypes("Click");
                                setUploadClick(true);
                            } }, "Close"))),
                    isCutOut === false && visibleStickerHover && (React.createElement(Animate, { isMounted: isCutOutMounted },
                        React.createElement("p", { className: "my-2 text-xs opacity-70" }, "See Cut-outs"))),
                    isCutOut && (React.createElement(React.Fragment, null,
                        React.createElement(Animate, { isMounted: isCutOut },
                            React.createElement("p", { className: "my-1 text-xs text-blue-700" }, "See Cut-outs"),
                            React.createElement("div", { className: "overflow-y-auto h-[30rem] text-center" }, stickers.map((el, i) => (React.createElement("img", { key: i, className: `sticker m-5 max-w-[75%] max-h-20 md:max-h-24 lg:max-h-28 xl:max-h-32 cursor-pointer inline hover:opacity-100 ${i === activeSticker ? "sticker-select" : ""}`, alt: "sticker", src: el.toDataURL(), onClick: (e) => handleStickerClick(i) }))))))))))));
};
export default SegmentDrawer;
//# sourceMappingURL=SegmentDrawer.js.map