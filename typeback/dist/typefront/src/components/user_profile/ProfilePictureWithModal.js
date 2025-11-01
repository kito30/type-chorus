"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImageModal_1 = require("./ImageModal");
require("../../styles/Profile.css");
const DEFAULT_PIC = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const ProfilePictureWithModal = () => {
    const [imageUrl, setImageUrl] = (0, react_1.useState)(DEFAULT_PIC);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const stored = localStorage.getItem("profile.imageUrl");
        if (stored)
            setImageUrl(stored);
    }, []);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleSave = (newUrl) => {
        setImageUrl(newUrl);
        localStorage.setItem("profile.imageUrl", newUrl);
    };
    return (<div className="profile-container">
      
      <div className="profile-picture-wrapper" onClick={openModal}>
        <img src={imageUrl} alt="Profile" className="profile-picture"/>
      </div>

      
      <ImageModal_1.default isOpen={isModalOpen} initialUrl={imageUrl} onClose={closeModal} onSave={handleSave} previewHeight={80} previewWidth={80} promptText="Change Profile Picture"/>
    </div>);
};
exports.default = ProfilePictureWithModal;
//# sourceMappingURL=ProfilePictureWithModal.js.map