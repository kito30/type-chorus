"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("../../styles/Profile.css");
const UsernameModal = ({ isOpen, initialUsername, onClose, onSave, }) => {
    const [newUsername, setNewUsername] = (0, react_1.useState)(initialUsername);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setNewUsername(initialUsername);
        }
    }, [isOpen, initialUsername]);
    const handleSave = () => {
        if (newUsername.trim()) {
            onSave(newUsername);
        }
        else {
            alert("Username cannot be empty!");
        }
        onClose();
    };
    if (!isOpen)
        return null;
    return (<div>
      <div className="modal-screen-overlay"></div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Change Username</h2>
          <input type="text" placeholder="Enter new username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>
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
exports.default = UsernameModal;
//# sourceMappingURL=UsernameModal.js.map