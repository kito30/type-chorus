import BackgroundPicture from "../components/BackgroundPicture";
import ProfilePictureWithModal from "../components/ProfilePictureWithModal";
import "../styles/Profile.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-column">
        {/* changeable background picture */}
        <BackgroundPicture />

        {/* changeable profile picture */}
        <ProfilePictureWithModal />

        <div className="divider"></div>
        {/* changeable username */}
        <div className="username">Your Username</div>

        {/* highscore */}
        <div className="highscore">Highscore: 12345</div>

        {/* other stats */}
        <div className="stats">Wins: 10 | Losses: 2</div>
      </div>
    </div>
  );
};

export default Profile;
