
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Profile from './pages/Profile'
import Home from './pages/Home'
import LoginCard from './components/login_profile/logincard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginCard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
