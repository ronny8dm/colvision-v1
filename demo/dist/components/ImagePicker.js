import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import PhotoAlbum from "react-photo-album";
import photos from "./helpers/photos";
import AppContext from "./hooks/createContext";
const ImagePicker = ({ handleSelectedImage, showGallery: [showGallery, setShowGallery], }) => {
    const [error, setError] = useState("");
    const [isLoadedCount, setIsLoadedCount] = useState(0);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { enableDemo: [enableDemo, setEnableDemo], } = useContext(AppContext);
    // const location = useLocation();
    const path = `${window.location.origin.toString()}`;
    const isMobile = window.innerWidth < 768;
    const downloadAllImageResponses = () => {
        photos.forEach((photo, i) => {
            setTimeout(() => {
                handleSelectedImage(new URL(photo.src, path), {
                    shouldDownload: true,
                });
            }, i * 30000);
        });
    };
    const handleAttemptContinue = () => {
        setAcceptedTerms(true);
        setTimeout(() => setEnableDemo(true), 500);
    };
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
    const image = ({ imageProps }) => {
        const { src, key, style, onClick } = imageProps;
        return (React.createElement("img", { className: "m-0 lg:hover:opacity-50 active:opacity-50", key: key, src: src, style: style, onClick: (e) => onClick(e, { index: 0 }), onLoad: () => {
                setIsLoadedCount((prev) => prev + 1);
            } }));
    };
    const onClickPhoto = (src) => {
        console.log(src);
    };
    // return (
    //   <div className="pt-6 mx-4">
    //     <Button onClick={downloadAllImageResponses}>
    //       Download All Image Responses
    //     </Button>
    // <div
    //   className={`h-full w-full overflow-y-scroll pb-20 ${
    //     showGallery ? "fade-in" : ""
    //   }`}
    // >
    //       <PhotoAlbum
    //         layout={isMobile ? "columns" : "rows"}
    //         photos={photos}
    //         columns={1}
    //         onClick={(e: any) => handleSelectedImage(e.photo.src)}
    //         renderPhoto={image}
    //       />
    //     </div>
    //   </div>
    // );
    return (React.createElement("div", { className: `h-full w-full overflow-y-scroll p-4 ${showGallery ? "fade-in" : ""}` },
        React.createElement(PhotoAlbum, { layout: isMobile ? "columns" : "rows", photos: photos, columns: 1, onClick: (e) => handleSelectedImage(e.photo.src), renderPhoto: image })));
};
export default ImagePicker;
//# sourceMappingURL=ImagePicker.js.map