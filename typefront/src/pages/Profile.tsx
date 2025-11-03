import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePictureWithModal from "../components/user_profile/ProfilePictureWithModal";
import UsernameModal from "../components/user_profile/UsernameModal";
import EmailModal from "../components/user_profile/EmailModal";
import ResetPasswordModal from "../components/user_profile/ResetPasswordModal";
import { useAuth } from "../contexts/AuthContextType";
import "../styles/Profile.css";

type RecentSong = {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  playedAt: number;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [username, setUsername] = useState<string>("Your Username");
  const [email, setEmail] = useState<string>("user@example.com");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [recentSong, setRecentSong] = useState<RecentSong | null>(null);
  const [highestScoredSongs, setHighestScoredSongs] = useState<RecentSong[]>([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "Your Username");
      setEmail(user.email || "user@example.com");
    }
  }, [user]);

  useEffect(() => {
    const storedRecentSong = localStorage.getItem("profile.recentSong");
    if (storedRecentSong) {
      try {
        setRecentSong(JSON.parse(storedRecentSong));
      } catch {
      }
    }
    const storedHighestScores = localStorage.getItem("profile.highestScoredSongs");
    if (storedHighestScores) {
      try {
        setHighestScoredSongs(JSON.parse(storedHighestScores));
      } catch {
      }
    }
  }, []);

  const openUsernameModal = () => setIsUsernameModalOpen(true);
  const closeUsernameModal = () => setIsUsernameModalOpen(false);
  const handleUsernameSave = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem("profile.username", newUsername);
  };

  const openEmailModal = () => setIsEmailModalOpen(true);
  const closeEmailModal = () => setIsEmailModalOpen(false);
  const handleEmailSave = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem("profile.email", newEmail);
  };

  const openResetModal = () => setIsResetModalOpen(true);
  const closeResetModal = () => setIsResetModalOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="profile-page">
        <div className="profile-column">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-column">
        <header className="profile-header">
          <h1 className="profile-title">PROFILE</h1>
          <p className="profile-subtitle">Your account and recent activity</p>
        </header>

        <section className="profile-top-section">
          <div className="profile-avatar-left">
            <ProfilePictureWithModal />
          </div>

          <div className="profile-details-right">
            <h3 className="section-header">Details</h3>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{username}</span>
                <button className="link-btn" onClick={openUsernameModal}>Edit</button>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{email}</span>
                <button className="link-btn" onClick={openEmailModal}>Edit</button>
              </div>
              <div className="detail-row">
                <span className="detail-label">Password:</span>
                <span className="detail-value">••••••••</span>
                <button className="link-btn" onClick={openResetModal}>Reset</button>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-recent-section">
          <h3 className="section-header">Recently Played</h3>
          {recentSong ? (
            <div 
              className="recent-card spotlight" 
              onClick={() => navigate(`/game/${recentSong.id}`)}
            >
              <div className="recent-song-info">
                <div className="recent-song-title">{recentSong.trackName}</div>
                <div className="recent-song-artist">{recentSong.artistName}</div>
                {recentSong.albumName && (
                  <div className="recent-song-album">{recentSong.albumName}</div>
                )}
              </div>
              <div className="recent-play-arrow">→</div>
            </div>
          ) : (
            <div className="recent-card spotlight muted-text">
              <div>No recent songs</div>
              <div className="recent-subtitle">Complete a typing game to see it here</div>
            </div>
          )}
        </section>

        <section className="profile-highest-scores-section">
          <h3 className="section-header">Highest Scored Songs</h3>
          {highestScoredSongs.length > 0 ? (
            <div className="highest-scores-list">
              {highestScoredSongs.map((song, index) => (
                <div 
                  key={song.id || index}
                  className="score-card spotlight"
                  onClick={() => navigate(`/game/${song.id}`)}
                >
                  <div className="score-rank">#{index + 1}</div>
                  <div className="score-song-info">
                    <div className="score-song-title">{song.trackName}</div>
                    <div className="score-song-artist">{song.artistName}</div>
                  </div>
                  <div className="score-value">---</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="recent-card spotlight muted-text">
              <div>No scored songs yet</div>
              <div className="recent-subtitle">Play games to see your highest scores here</div>
            </div>
          )}
        </section>

        <section className="profile-logout-section" style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout}
            className="logout-btn"
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            Logout
          </button>
        </section>
      </div>

      <UsernameModal
        isOpen={isUsernameModalOpen}
        initialUsername={username}
        onClose={closeUsernameModal}
        onSave={handleUsernameSave}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        initialEmail={email}
        onClose={closeEmailModal}
        onSave={handleEmailSave}
      />

      <ResetPasswordModal isOpen={isResetModalOpen} email={email} onClose={closeResetModal} />
    </div>
  );
};

export default Profile;
