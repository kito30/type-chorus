import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.css'
import LoginCard from './components/login_profile/logincard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginCard />
  </StrictMode>,
)
