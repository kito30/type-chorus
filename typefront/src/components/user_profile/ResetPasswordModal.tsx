import React from "react";
import "../../styles/Profile.css";

interface ResetPasswordModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, email, onClose }) => {
  const handleSend = () => {
    alert(`A password reset link would be sent to: ${email}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Reset Password</h2>
          <p className="muted-text">We'll send a reset link to:</p>
          <div className="pill-field">{email}</div>
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>Close</button>
            <button className="save-btn" onClick={handleSend}>Send reset link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;


