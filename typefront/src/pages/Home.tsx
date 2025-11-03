import React, { useState, useEffect, useRef } from 'react'
import Search from '../components/search/Search'
import { Link, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/logo.svg';
import LoginCard from '../components/login_profile/logincard';
import { useAuth } from '../contexts/AuthContextType';

const Home: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem("profile.imageUrl");
      if (stored) {
        setProfileImageUrl(stored);
      } else {
        setProfileImageUrl("https://cdn-icons-png.flaticon.com/512/847/847969.png");
      }
    } else {
      setProfileImageUrl("https://cdn-icons-png.flaticon.com/512/847/847969.png");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginOpen(false);
      }
    };

    if (isLoginOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginOpen]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setIsLoginOpen(!isLoginOpen);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--color-home-bg) text-(--color-text)">
      <header className="flex items-center justify-between w-full px-6 py-4">
        <div className="pl-4">
          <Link to="/" className="text-(--color-text) font-semibold hover:text-gray-300">Type Chorus</Link>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:scale-150 hover:opacity-80 hover:-translate-x-3"
            >
              <img 
                src={profileImageUrl} 
                alt={isAuthenticated ? "Profile" : "Sign in"} 
                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                }}
              />
            </button>
            {!isAuthenticated && isLoginOpen && (
              <div className="absolute right-0 mt-2 z-50">
                <LoginCard onClose={() => setIsLoginOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </header>
   
      <main className="flex-1 flex flex-col items-center justify-center">
          <img src={logoUrl} alt="Logo" className="w-2xl" />
          <Search />
      </main>
    </div>
  );
};

export default Home;
