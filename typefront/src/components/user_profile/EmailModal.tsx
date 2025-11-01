import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";

interface EmailModalProps {
  isOpen: boolean;
  initialEmail: string;
  onClose: () => void;
  onSave: (email: string) => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, initialEmail, onClose, onSave }) => {
  const [email, setEmail] = useState<string>(initialEmail);

  useEffect(() => {
    if (isOpen) setEmail(initialEmail);
  }, [isOpen, initialEmail]);

  const handleSave = () => {
    if (!email.trim()) {
      alert("Email cannot be empty!");
      return onClose();
    }
    onSave(email.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Change Email</h2>
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;


