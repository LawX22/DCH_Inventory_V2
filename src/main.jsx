import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import '../src/css/Header.css'
import '../src/css/Inventory.css'
import '../src/css/LogIn.css'
import '../src/css/activity.css'

import StaffRoute from './staffRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StaffRoute/>
  </StrictMode>

   
)
