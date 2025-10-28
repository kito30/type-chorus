import React, { useState } from "react";
import "../../styles/Profile.css";

interface UsernameModalProps {
  isOpen: boolean;
  initialUsername: string;
  onClose: () => void;
  onSave: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({
  isOpen,
  initialUsername,
  onClose,
  onSave,
}) => {
  const [newUsername, setNewUsername] = useState<string>(initialUsername);

  const handleSave = () => {
    if (newUsername.trim()) {
      onSave(newUsername);
    } else {
      alert("Username cannot be empty!");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Change Username</h2>
          <input
            type="text"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
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

export default UsernameModal;
