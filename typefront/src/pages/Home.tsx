import React from 'react'
import SearchBar from '../components/home/SearchBar'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-(--color-home-bg) text-(--color-text)">
      <header className="flex items-center justify-between w-full px-6 py-4">
        <div className="pl-4">
          <Link to="/" className="text-(--color-text) font-semibold hover:text-gray-300">Type Chorus</Link>
        </div>
        <div className="">
          <Link 
            to="/profile" 
            className="flex items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:scale-150 hover:opacity-80 hover:-translate-x-3"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
              alt="Profile" 
              className="w-10 h-10 object-cover rounded-full"
            />
          </Link>
        </div>
      </header>
      <main className="flex-1 grid place-items-center">
        <div className="max-w-screen max-h-full overflow-auto">
          <div className="flex flex-col items-center gap-4">
            <div>Type Front</div>
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
