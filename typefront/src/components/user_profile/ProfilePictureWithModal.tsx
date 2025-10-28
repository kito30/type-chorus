import React, { useState } from "react";
import ImageModal from "./ImageModal";
import "../../styles/Profile.css";

const DEFAULT_PIC =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const ProfilePictureWithModal: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_PIC);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSave = (newUrl: string) => setImageUrl(newUrl);

  return (
    <div className="profile-container">
      {/* Profile Picture */}
      <div className="profile-picture-wrapper" onClick={openModal}>
        <img src={imageUrl} alt="Profile" className="profile-picture" />
      </div>

      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        initialUrl={imageUrl}
        onClose={closeModal}
        onSave={handleSave}
        previewHeight={80}
        previewWidth={80}
        promptText="Change Profile Picture"
      />
    </div>
  );
};

export default ProfilePictureWithModal;
