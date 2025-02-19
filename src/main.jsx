import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Inventory.css'
import './Header.css'
import Inventory from './Inventory.jsx'
import StockInOut from './stockInOut.jsx'
import App from './staffRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App/>
  </StrictMode>,
)
