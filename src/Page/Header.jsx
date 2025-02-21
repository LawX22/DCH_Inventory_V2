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
  const location = useLocation(); // Get the current URL path

  // Logout Function
  // Logout Function with Confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
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
        <div className={`nav-item ${isActive("/Inventory")}`}>
          <FaBoxes className="nav-icon" />
          <span>
            <a href="/Inventory">Inventory</a>
          </span>
        </div>
        <div className={`nav-item ${isActive("/StockInOut")}`}>
          <FaExchangeAlt className="nav-icon" />
          <span>
            <a href="/StockInOut">Stock In/Out</a>
          </span>
        </div>
        <div className={`nav-item ${isActive("/stockHistory")}`}>
          <FaHistory className="nav-icon" />
          <span>
            <a href="/stockHistory">Stock History</a>
          </span>
        </div>
        <div className={`nav-item ${isActive("/Suppliers")}`}>
          <FaTruck className="nav-icon" />
          <span>Suppliers</span>
        </div>
        <div className={`nav-item ${isActive("/Orders")}`}>
          <FaClipboardList className="nav-icon" />
          <span>Orders</span>
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
