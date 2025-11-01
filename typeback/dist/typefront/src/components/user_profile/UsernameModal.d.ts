import React from "react";
import "../../styles/Profile.css";
interface UsernameModalProps {
    isOpen: boolean;
    initialUsername: string;
    onClose: () => void;
    onSave: (username: string) => void;
}
declare const UsernameModal: React.FC<UsernameModalProps>;
export default UsernameModal;
