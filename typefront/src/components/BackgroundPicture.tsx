import React, { useState } from "react";
import ImageModal from "./ImageModal";
import "../styles/Profile.css";

const DEFAULT_PIC =
  "https://img.freepik.com/free-vector/overlapping-forms-wallpaper_52683-46441.jpg";

const BackgroundPicture: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_PIC);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSave = (newUrl: string) => setImageUrl(newUrl);

  return (
    <div className="background-container">
      {/* Background Picture */}
      <div className="background-picture-wrapper" onClick={openModal}>
        <img src={imageUrl} alt="Background" className="background-picture" />
      </div>

      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        initialUrl={imageUrl}
        onClose={closeModal}
        onSave={handleSave}
        previewHeight={120}
        previewWidth={200}
        promptText="Change Background Picture"
      />
    </div>
  );
};

export default BackgroundPicture;
