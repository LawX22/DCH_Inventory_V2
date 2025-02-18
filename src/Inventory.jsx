import React, { useState, useEffect } from 'react';
import './Inventory.css';
import Header from './Header';


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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [warehouseOptions] = useState(['Warehouse', 'Warehouse A', 'Warehouse B']);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [inventory, setInventory] = useState([]);


  useEffect(() => {
    fetch("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php")
      .then((response) => response.json())
      .then((data) => {
        setInventory(data);
        
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
     
      });
  }, []);



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
    <div className="inventory-container">
      {/* Header with navigation */}
      <Header/>

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
          <button 
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedWarehouse}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {warehouseOptions.map(option => (
                <div 
                  key={option} 
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedWarehouse(option);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
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

      {/* Inventory table with fixed header and scrollable body */}
      <div className="inventory-table">
        <div className="table-header">
          <div 
            className={`header-cell with-arrow ${sortField === 'item' ? 'sorted' : ''}`}
            onClick={() => handleSort('item')}
          >
            <span>Item</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={`arrow-icon ${sortField === 'item' && sortDirection === 'desc' ? 'flipped' : ''}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div 
            className={`header-cell with-arrow ${sortField === 'brand' ? 'sorted' : ''}`}
            onClick={() => handleSort('brand')}
          >
            <span>Brand</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={`arrow-icon ${sortField === 'brand' && sortDirection === 'desc' ? 'flipped' : ''}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div 
            className={`header-cell with-arrow ${sortField === 'location' ? 'sorted' : ''}`}
            onClick={() => handleSort('location')}
          >
            <span>Location</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={`arrow-icon ${sortField === 'location' && sortDirection === 'desc' ? 'flipped' : ''}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div 
            className={`header-cell ${sortField === 'price' ? 'sorted' : ''}`}
            onClick={() => handleSort('price')}
          >
            Price
          </div>
          <div 
            className={`header-cell ${sortField === 'inventory' ? 'sorted' : ''}`}
            onClick={() => handleSort('inventory')}
          >
            Inventory
          </div>
          <div className="header-cell">Actions</div>
        </div>
        
        {/* Scrollable table body */}
        <div className="table-body">
          {inventory.map((item) => (
            <div className="table-row" key={item.inventory_id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} className="item-image" />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.itemDesc_1 +' '+item.itemDesc_2}</div>
                  <div className="item-category">{item.category}</div>
                  <div className="item-id">{item.itemCode}</div>
                </div>
              </div>
              <div className="brand-cell">{item.brand}</div>
              <div className="location-cell">
                <div>{item.location}</div>
                <div>{item.storage_area}</div>
              </div>
              <div className="price-cell">
                <div>Price - ₱ {item.price}</div>
                <div>Retail - ₱ {item.retail_price}</div>
              </div>
              <div className="inventory-cell">
                <div>Stock - {item.units}</div>
                <div>TSV - ₱ {item.totalstockValue}</div>
              </div>
              <div className="actions-cell">
                <button className="action-button view-button" onClick={() => handleViewItem(item)}>
                  <span className="action-icon"><EyeIcon /></span>
                  <span>View</span>
                </button>
                <button className="action-button delete-button" onClick={() => handleDeleteItem(item)}>
                  <span className="action-icon"><TrashIcon /></span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Inventory;