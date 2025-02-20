import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './Inventory.css';
import './css/Header.css';
import './LogIn.css';

import StaffRoute from './staffRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <StaffRoute/>
  </StrictMode>
)
