"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("../../styles/Profile.css");
const DEFAULT_PIC = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const ImageModal = ({ isOpen, initialUrl, onClose, onSave, previewHeight = 120, previewWidth = 120, promptText = 'Change Picture' }) => {
    const [inputUrl, setInputUrl] = (0, react_1.useState)(initialUrl);
    const [previewUrl, setPreviewUrl] = (0, react_1.useState)(initialUrl);
    const [isPreviewValid, setIsPreviewValid] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (!inputUrl) {
            setPreviewUrl(DEFAULT_PIC);
            setIsPreviewValid(true);
            return;
        }
        const img = new Image();
        img.onload = () => {
            setPreviewUrl(inputUrl);
            setIsPreviewValid(true);
        };
        img.onerror = () => {
            setPreviewUrl(DEFAULT_PIC);
            setIsPreviewValid(false);
        };
        img.src = inputUrl;
    }, [inputUrl]);
    const handleSave = () => {
        if (!isPreviewValid || !inputUrl) {
            alert("Invalid or empty image URL — reverted to default.");
            onSave(DEFAULT_PIC);
        }
        else {
            onSave(previewUrl);
        }
        onClose();
    };
    if (!isOpen)
        return null;
    return (<div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{promptText}</h2>

          <div className="modal-preview" style={{ width: previewWidth, height: previewHeight }}>
            <img src={previewUrl} alt="Preview" className={promptText.includes("Background")
            ? "background-preview-image"
            : "profile-preview-image"}/>

          </div>

          {!isPreviewValid && (<p className="error-text">
              Invalid image URL — preview reverted to default.
            </p>)}

          <p>Input a valid image url:</p>
          <input type="text" placeholder="Enter image URL..." value={inputUrl} onChange={(e) => setInputUrl(e.target.value)}/>

          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = ImageModal;
//# sourceMappingURL=ImageModal.js.map