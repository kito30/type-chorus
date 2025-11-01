import React from "react";
import "../../styles/Profile.css";
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
declare const ImageModal: React.FC<ImageModalProps>;
export default ImageModal;
