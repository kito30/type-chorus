import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewUsername(initialUsername);
      setLoading(false);
      setError(null);
    }
  }, [isOpen, initialUsername]);

  const handleSave = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSave(newUsername);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Change Username</h2>
          {error && (
            <div style={{
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              border: "1px solid #dc2626",
              color: "#fca5a5",
              padding: "8px 12px",
              borderRadius: "4px",
              marginBottom: "12px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            disabled={loading}
          />
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameModal;
