"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImageModal_1 = require("./ImageModal");
require("../../styles/Profile.css");
const DEFAULT_PIC = "https://img.freepik.com/free-vector/overlapping-forms-wallpaper_52683-46441.jpg";
const BackgroundPicture = () => {
    const [imageUrl, setImageUrl] = (0, react_1.useState)(DEFAULT_PIC);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const stored = localStorage.getItem("profile.backgroundUrl");
        if (stored)
            setImageUrl(stored);
    }, []);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleSave = (newUrl) => {
        setImageUrl(newUrl);
        localStorage.setItem("profile.backgroundUrl", newUrl);
    };
    return (<div className="background-container">
      
      <div className="background-picture-wrapper" onClick={openModal}>
        <img src={imageUrl} alt="Background" className="background-picture"/>
      </div>

      
      <ImageModal_1.default isOpen={isModalOpen} initialUrl={imageUrl} onClose={closeModal} onSave={handleSave} previewHeight={120} previewWidth={200} promptText="Change Background Picture"/>
    </div>);
};
exports.default = BackgroundPicture;
//# sourceMappingURL=BackgroundPicture.js.map