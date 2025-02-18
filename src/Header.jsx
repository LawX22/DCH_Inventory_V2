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

function Header() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [warehouseOptions] = useState(['Warehouse', 'Warehouse A', 'Warehouse B']);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sample inventory data - let's add more items to demonstrate scrolling
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
      image: 'src/assets/bolt.png'
    },
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
      image: 'src/assets/bolt.png'
    },
    
  ];

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort items
  let filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortField) {
    filteredItems = [...filteredItems].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'item':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'brand':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        case 'location':
          aValue = a.location.warehouse.toLowerCase() + a.location.rack.toLowerCase();
          bValue = b.location.warehouse.toLowerCase() + b.location.rack.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'inventory':
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          return 0;
      }
      
      // Compare based on direction
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Basic handlers for the view and delete buttons
  const handleViewItem = (item) => {
    console.log('Viewing item:', item);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      console.log('Deleting item:', item);
    }
  };

  return (
   
      <header className="header">
        <div className="logo-container">
          <img src="src/assets/Logo.png" alt="Company Logo" className="logo" />
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

  );
}

export default Header;