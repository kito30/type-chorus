"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BackgroundPicture_1 = require("../components/user_profile/BackgroundPicture");
const ProfilePictureWithModal_1 = require("../components/user_profile/ProfilePictureWithModal");
const UsernameModal_1 = require("../components/user_profile/UsernameModal");
require("../styles/Profile.css");
const Profile = () => {
    const [username, setUsername] = (0, react_1.useState)("Your Username");
    const [isUsernameModalOpen, setIsUsernameModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const storedUsername = localStorage.getItem("profile.username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    const openUsernameModal = () => setIsUsernameModalOpen(true);
    const closeUsernameModal = () => setIsUsernameModalOpen(false);
    const handleUsernameSave = (newUsername) => {
        setUsername(newUsername);
        localStorage.setItem("profile.username", newUsername);
    };
    return (<div className="profile-page">
      <div className="profile-column">
        
        <BackgroundPicture_1.default />



        <div className="divider">
          <div className="profile-row">
            
            <ProfilePictureWithModal_1.default />

            
            <div className="username-wrapper">
              <div className="username" onClick={openUsernameModal}>
                {username}
              </div>
            </div>
          </div>
        </div>

        
        <div className="highscore">Highscore: 12345</div>

        
        <div className="stats">Wins: 10 | Losses: 2</div>
      </div>

      
      <UsernameModal_1.default isOpen={isUsernameModalOpen} initialUsername={username} onClose={closeUsernameModal} onSave={handleUsernameSave}/>
    </div>);
};
exports.default = Profile;
//# sourceMappingURL=Profile.js.map