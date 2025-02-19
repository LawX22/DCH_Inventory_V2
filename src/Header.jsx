import React, { useState } from 'react';
import { FaBars, FaTimes, FaBoxes, FaExchangeAlt, FaHistory, FaTruck, FaClipboardList } from 'react-icons/fa';
import './Inventory.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/src/assets/DCH.png" alt="DCH" className="DCH" />
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <div className="nav-item active">
          <FaBoxes className="nav-icon" />
          <span><a href="/Inventory">Inventory</a></span>
        </div>
        <div className="nav-item">
          <FaExchangeAlt className="nav-icon" />
          <span> <span><a href="/StockInOut">Stock In/Out</a></span></span>
        </div>
        <div className="nav-item">
          <FaHistory className="nav-icon" />
          <span> <span><a href="/stockHistory">Stock History</a></span></span>

        </div>
        <div className="nav-item">
          <FaTruck className="nav-icon" />
          <span>Suppliers</span>
        </div>
        <div className="nav-item">
          <FaClipboardList className="nav-icon" />
          <span>Orders</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
