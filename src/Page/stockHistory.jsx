import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineEye, AiOutlineDown } from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./Header";
import axios from "axios";


function StockHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);

      const [selectedLocation, setSelectedLocation] = useState(
        localStorage.getItem("selectedLocation") || "All"
      );

  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

useEffect(() => {
  axios
  .get("http://localhost/DCH_Inventory_V2/src/backend/load_stockHistory.php", {
    params: { location: selectedLocation },
  })
  .then((response) => setInventory(response.data))
  .catch((error) => console.error("Error fetching inventory:", error));
}, [selectedLocation]);

  return (
    <div className="inventory-container">
      <Header />

      {/* Action Panel */}
      <div className="action-panel">
      <div className="warehouse-dropdown">
          <button className="dropdown-button">
          <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Warehouse">Warehouse</option>
        <option value="store">Store</option>
      </select> 
      {/* <AiOutlineDown /> */}
          </button>
        </div>

        <div className="search-container">
          <AiOutlineSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search something..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Export Button */}
        <button className="export-button">
          <FiDownload size={18} />
          <span>Export</span>
        </button>

        {/* Activity Button */}
        <button className="activity-button">
          <FiActivity size={18} />
          <span>Activity</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell with-arrow">
            <span>Item</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Date</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Brand</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Location</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Activity</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>

          <div className="header-cell with-arrow">
            <span>Amount</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>

          <div className="header-cell with-arrow">
            <span>Units</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>

          <div className="header-cell with-arrow">
            <span>Requistion #</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>

          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {inventory.map((item) => (
            <div className="table-row" key={item.inventory_id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <img
                    src={"/src/assets/" + item.image}
                    alt={item.name}
                    className="item-image"
                  />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.stock_name}</div>
                  <div className="item-category">{item.category}</div>
                  <div className="item-id">{item.itemCode}</div>
                </div>
              </div>

              <div className="date-cell">
                {new Date(item.transaction_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="brand-cell">
                <div>{item.brand}</div>
              </div>
              <div className="location-cell">
                <div>{item.location}</div>
              </div>
              <div className="activity-cell">
                <div>{item.transaction_type}</div>
              </div>

              <div className="amount-cell">
                <div>{item.units_added}</div>
              </div>

              <div className="units-cell">
                <div>Current - {item.current_stock}</div>
                <div>Previous - {item.previous_units}</div>
              </div>

              <div className="Requistion-cell">
                <div>Stock - {item.requisition_number}</div>
              </div>

              <div className="actions-cell">
                <button className="action-button view-button">
                  <span className="action-icon">
                    <AiOutlineEye size={18} />
                  </span>
                  <span>Fix</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockHistory;
