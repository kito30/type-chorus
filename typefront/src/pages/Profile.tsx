import React, { useState } from "react";
import BackgroundPicture from "../components/user_profile/BackgroundPicture";
import ProfilePictureWithModal from "../components/user_profile/ProfilePictureWithModal";
import UsernameModal from "../components/user_profile/UsernameModal";
import "../styles/Profile.css";

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("Your Username");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);

  const openUsernameModal = () => setIsUsernameModalOpen(true);
  const closeUsernameModal = () => setIsUsernameModalOpen(false);
  const handleUsernameSave = (newUsername: string) => setUsername(newUsername);

  return (
    <div className="profile-page">
      <div className="profile-column">
        {/* Changeable background picture */}
        <BackgroundPicture />



        <div className="divider">
          <div className="profile-row">
            {/* Changeable profile picture */}
            <ProfilePictureWithModal />

            {/* Changeable username */}
            <div className="username-wrapper">
              <div className="username" onClick={openUsernameModal}>
                {username}
              </div>
            </div>
          </div>
        </div>

        {/* Highscore */}
        <div className="highscore">Highscore: 12345</div>

        {/* Other stats */}
        <div className="stats">Wins: 10 | Losses: 2</div>
      </div>

      {/* Username Change Modal */}
      <UsernameModal
        isOpen={isUsernameModalOpen}
        initialUsername={username}
        onClose={closeUsernameModal}
        onSave={handleUsernameSave}
      />
    </div>
  );
};

export default Profile;
