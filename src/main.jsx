import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Inventory.css'
import './Header.css'
import './LogIn.css'
import App from './staffRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App/>
  </StrictMode>,
)
