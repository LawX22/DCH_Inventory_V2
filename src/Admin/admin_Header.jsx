import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaBoxes,
  FaExchangeAlt,
  FaHistory,
  FaTruck,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout Function with Confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('username');
      localStorage.removeItem('userType');

      navigate("/");
    }
  };

  // Function to check if a nav item is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/src/assets/DCH.png" alt="DCH" className="DCH" />
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
        <div className={`nav-item ${isActive("/Admin_dashboard")}`} onClick={() => navigate("/Admin_dashboard")}>
          <FaBoxes className="nav-icon" />
          <span>Dashboard</span>
        </div>
        <div className={`nav-item ${isActive("/Admin_Inventory")}`} onClick={() => navigate("/Admin_Inventory")}>
          <FaBoxes className="nav-icon" />
          <span>Admin Inventory</span>
        </div>
        <div className={`nav-item ${isActive("/Admin_stockHistory")}`} onClick={() => navigate("/Admin_stockHistory")}>
          <FaHistory className="nav-icon" />
          <span>Admin Stock History</span>
        </div>
        <div className={`nav-item ${isActive("/Suppliers")}`} onClick={() => navigate("/Suppliers")}>
          <FaTruck className="nav-icon" />
          <span>Admin Suppliers</span>
        </div>
        <div className={`nav-item ${isActive("/Orders")}`} onClick={() => navigate("/Orders")}>
          <FaClipboardList className="nav-icon" />
          <span>Admin Orders</span>
        </div>

        {/* Logout Button */}
        <div className="nav-item logout" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
