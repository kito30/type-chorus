import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";

const DEFAULT_PIC =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

interface ImageModalProps {
  isOpen: boolean;
  initialUrl: string;
  onClose: () => void;
  onSave: (url: string) => void;
  previewSize?: number;
  previewHeight?: number;
  previewWidth?: number;
  promptText?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  initialUrl,
  onClose,
  onSave,
  previewHeight = 120, // default
  previewWidth = 120,
  promptText = 'Change Picture'
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
    <div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{promptText}</h2>

          <div
            className="modal-preview"
            style={{ width: previewWidth, height: previewHeight }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className={
                promptText.includes("Background")
                  ? "background-preview-image"
                  : "profile-preview-image"
              }
            />

          </div>

          {!isPreviewValid && (
            <p className="error-text">
              Invalid image URL — preview reverted to default.
            </p>
          )}

          <p>Input a valid image url:</p>
          <input
            type="text"
            placeholder="Enter image URL..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />

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
    </div>
  );
};

export default ImageModal;
