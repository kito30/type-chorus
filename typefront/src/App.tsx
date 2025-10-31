import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import GamePage from './pages/GamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
