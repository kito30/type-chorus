import React, { useEffect, useState } from "react";
import "../styles/ProfilePicture.css";

const DEFAULT_PIC =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

interface ImageModalProps {
  isOpen: boolean;
  initialUrl: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  initialUrl,
  onClose,
  onSave,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(initialUrl);
  const [isPreviewValid, setIsPreviewValid] = useState<boolean>(true);

  useEffect(() => {
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
    } else {
      onSave(previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Change Profile Picture</h2>

        {/* Preview */}
        <div className="modal-preview">
          <img src={previewUrl} alt="Preview" className="profile-picture" />
        </div>

        {!isPreviewValid && (
          <p className="error-text">
            Invalid image URL — preview reverted to default.
          </p>
        )}

        {/* Input */}
        <input
          type="text"
          placeholder="Enter image URL..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />

        {/* Buttons */}
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
  );
};

export default ImageModal;
