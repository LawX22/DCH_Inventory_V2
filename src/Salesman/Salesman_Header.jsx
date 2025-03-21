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

  function clearHeaderFilter(){
    localStorage.setItem("activityTypeAH", ""); // Set brand to empty string (or any value you want)
    localStorage.setItem("dateAH", ""); // Set area to empty string
    localStorage.setItem("userAH", ""); //
localStorage.setItem("brand", ""); // Set brand to empty string (or any value you want)
localStorage.setItem("area", ""); // Set area to empty string
localStorage.setItem("category", ""); 
localStorage.setItem("brandSH", ""); // Set brand to empty string (or any value you want)
localStorage.setItem("areaSH", ""); // Set area to empty string
localStorage.setItem("dateSH", ""); // Set category to empty string
localStorage.getItem("categorySH", "");
  }

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
        <div className={`nav-item ${isActive("/Salesman_PriceList")}`} onClick={() => {
    clearHeaderFilter();
    navigate("/Salesman_PriceList");
  }}>
          <FaBoxes className="nav-icon" />
          <span>Price List</span>
        </div>

        <div className={`nav-item ${isActive("/Orders")}`} onClick={() => navigate("/Orders")}>
          <FaClipboardList className="nav-icon" />
          <span>Requisitions</span>
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
