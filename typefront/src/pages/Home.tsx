import React from 'react'
import SearchBar from '../components/home/SearchBar'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className=" h-screen bg-(--color-home-bg) text-(--color-text) overflow-x-hidden">
      <header className="flex items-center justify-between w-full px-6 py-4 bg-(--color-home-bg) text-(--color-text)">
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
      <div className="flex items-center justify-center ">
        <SearchBar />
      </div>
    </div>
  )
}

export default Home


