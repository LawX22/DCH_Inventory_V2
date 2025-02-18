import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Inventory.css'
import Inventory from './Inventory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Inventory/>
  </StrictMode>,
)
