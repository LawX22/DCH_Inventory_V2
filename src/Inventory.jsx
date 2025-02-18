import React, { useState } from 'react';
import './Inventory.css';

// Custom icon components
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 6L6 20C6 20.5304 6.21071 21.0391 6.58579 21.4142C6.96086 21.7893 7.46957 22 8 22H16C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function Inventory() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample inventory data - let's add a few more items for realism
  const inventoryItems = [
    {
      id: 'FL0008192',
      name: 'METRIC YELLOW BOLT',
      category: 'BOLT',
      brand: 'PLATED',
      location: {
        warehouse: 'Warehouse',
        rack: 'Rack A'
      },
      price: 500.00,
      retail: 560.00,
      stock: 2,
      tsv: 1000.00,
      image: '/bolt.png' // Replace with actual path to your image
    },
    {
      id: 'FL0009335',
      name: 'STAINLESS STEEL SCREW',
      category: 'SCREW',
      brand: 'PLATED',
      location: {
        warehouse: 'Warehouse',
        rack: 'Rack B'
      },
      price: 120.00,
      retail: 180.00,
      stock: 15,
      tsv: 2700.00,
      image: '/screw.png'
    },
    {
      id: 'FL0010472',
      name: 'CHROME NUT',
      category: 'NUT',
      brand: 'METAL',
      location: {
        warehouse: 'Warehouse',
        rack: 'Rack C'
      },
      price: 85.00,
      retail: 125.00,
      stock: 30,
      tsv: 3750.00,
      image: '/nut.png'
    },
    {
      id: 'FL0011587',
      name: 'ZINC WASHER',
      category: 'WASHER',
      brand: 'METAL',
      location: {
        warehouse: 'Warehouse',
        rack: 'Rack A'
      },
      price: 30.00,
      retail: 45.00,
      stock: 50,
      tsv: 2250.00,
      image: '/washer.png'
    }
  ];

  return (
    <div className="inventory-container">
      {/* Header with navigation */}
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="Company Logo" className="logo" />
        </div>
        <nav className="main-nav">
          <div className="nav-item active">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Inventory</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5H3V21H17V17" stroke="currentColor" strokeWidth="2" />
                <rect x="7" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M12 10L17 10" stroke="currentColor" strokeWidth="2" />
                <path d="M14.5 7.5L14.5 12.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Stock in/out</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Stock History</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                <path d="M7 15H17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Suppliers</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Orders</span>
          </div>
        </nav>
      </header>

      {/* Action panel */}
      <div className="action-panel">
        <button className="add-button">
          <span>Add New Item</span>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="add-icon">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" />
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div className="warehouse-dropdown">
          <button className="dropdown-button">
            {selectedWarehouse}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="search-container">
          <div className="search-icon">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search something......"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="export-button">Export</button>
        <button className="activity-button">Activity</button>
      </div>

      {/* Inventory table */}
      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell with-arrow">
            <span>Item</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="header-cell with-arrow">
            <span>Brand</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="header-cell with-arrow">
            <span>Location</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Inventory</div>
          <div className="header-cell">Actions</div>
        </div>

        {inventoryItems.map((item) => (
          <div className="table-row" key={item.id}>
            <div className="item-cell">
              <div className="item-image-container">
                <img src={item.image} alt={item.name} className="item-image" />
              </div>
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-category">{item.category}</div>
                <div className="item-id">{item.id}</div>
              </div>
            </div>
            <div className="brand-cell">{item.brand}</div>
            <div className="location-cell">
              <div>{item.location.warehouse}</div>
              <div>{item.location.rack}</div>
            </div>
            <div className="price-cell">
              <div>Price - ₱ {item.price.toFixed(2)}</div>
              <div>Retail - ₱ {item.retail.toFixed(2)}</div>
            </div>
            <div className="inventory-cell">
              <div>Stock - {item.stock}</div>
              <div>TSV - ₱ {item.tsv.toFixed(2)}</div>
            </div>
            <div className="actions-cell">
              <button className="action-button view-button">
                <span className="action-icon"><EyeIcon /></span>
                <span>View</span>
              </button>
              <button className="action-button delete-button">
                <span className="action-icon"><TrashIcon /></span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;   