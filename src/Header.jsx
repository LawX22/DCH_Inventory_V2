import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // React Router Navigation Hook

  // Logout Function
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored data
    navigate("/"); // Redirect to login page (Update path if needed)
  };

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
        <div className="nav-item active">
          <FaBoxes className="nav-icon" />
          <span>
            <a href="/Inventory">Inventory</a>
          </span>
        </div>
        <div className="nav-item">
          <FaExchangeAlt className="nav-icon" />
          <span>
            <a href="/StockInOut">Stock In/Out</a>
          </span>
        </div>
        <div className="nav-item">
          <FaHistory className="nav-icon" />
          <span>
            <a href="/stockHistory">Stock History</a>
          </span>
        </div>
        <div className="nav-item">
          <FaTruck className="nav-icon" />
          <span>Suppliers</span>
        </div>
        <div className="nav-item">
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
