const getFile = async (data) => {
    const response = await fetch(data);
    const blob = await response.blob();
    return new File([blob], "image.jpeg");
};
export default getFile;
//# sourceMappingURL=files.js.map