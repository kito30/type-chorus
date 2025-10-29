import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

const Home: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="brand">Type Chorus</div>
        <nav className="nav-actions">
          <Link to="/profile" className="icon-button" aria-label="Profile">
            {/* simple profile glyph */}
            <span className="profile-circle" />
          </Link>
          <Link to="/login" className="primary-button">Login</Link>
        </nav>
      </header>

      <main className="home-main">
        {!showSearch ? (
          <button className="search-toggle" onClick={() => setShowSearch(true)}>
            Search
          </button>
        ) : (
          <div className="search-box">
            <input
              className="search-input"
              placeholder="Search (coming soon)"
              autoFocus
            />
            <button className="secondary-button" onClick={() => setShowSearch(false)}>Close</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home


