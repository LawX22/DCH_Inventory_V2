import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineDown,
} from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./Header";

function ActivityReport() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("Warehouse");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch("http://localhost/DCH_Inventory_V2/src/backend/load_activityReport.php")
      .then((response) => response.json())
      .then((data) => setInventory(data))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewItem = (item) => {
    console.log("Viewing item:", item);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      console.log("Deleting item:", item);
    }
  };

  return (
    <div className="inventory-container">
      <Header />

      {/* Action Panel */}
      <div className="action-panel">
        {/* <button className="add-button">
          <AiOutlinePlus size={18} />
          <span>Add New Item</span>
        </button> */}

        <div className="warehouse-dropdown">
          <button className="dropdown-button">
            {selectedWarehouse} <AiOutlineDown />
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
        {/* <button className="export-button">
          <FiDownload size={18} />
          <span>Export</span>
        </button> */}

        {/* Activity Button */}
        {/* <button className="activity-button">
          <FiActivity size={18} />
          <span>Activity</span>
        </button> */}
      </div>

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          {/* <div
            className="header-cell with-arrow"
            onClick={() => handleSort("item")}
          >
            <span>Item</span>{" "}
            <AiOutlineDown
              className={
                sortField === "item" && sortDirection === "desc"
                  ? "flipped"
                  : ""
              }
            />
          </div> */}
          <div
            className="header-cell with-arrow"
            onClick={() => handleSort("brand")}
          >
            <span>Date</span>{" "}
            <AiOutlineDown
              className={
                sortField === "brand" && sortDirection === "desc"
                  ? "flipped"
                  : ""
              }
            />
          </div>
          <div
            className="header-cell with-arrow"
            onClick={() => handleSort("location")}
          >
            <span>User</span>{" "}
            <AiOutlineDown
              className={
                sortField === "location" && sortDirection === "desc"
                  ? "flipped"
                  : ""
              }
            />
          </div>
          <div
            className="header-cell with-arrow"
            onClick={() => handleSort("price")}
          >
            <span>Activity Type</span>{" "}
            <AiOutlineDown
              className={
                sortField === "price" && sortDirection === "desc"
                  ? "flipped"
                  : ""
              }
            />
          </div>
          <div
            className="header-cell with-arrow"
            onClick={() => handleSort("inventory")}
          >
            <span>Activity</span>{" "}
            <AiOutlineDown
              className={
                sortField === "inventory" && sortDirection === "desc"
                  ? "flipped"
                  : ""
              }
            />
          </div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {inventory.map((item) => (
            <div className="table-row" key={item.inventory_id}>
              {/* <div className="item-cell">
                <div className="item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                </div>

                <div className="item-details">
                  <div className="item-name">
                    {item.itemDesc_1 + " " + item.itemDesc_2}
                  </div>
                  <div className="item-category">{item.category}</div>
                  <div className="item-id">{item.itemCode}</div>
                </div>
              </div> */}
              <div className="brand-cell">{item.activity_performed}</div>
              <div className="location-cell">
                <div>{item.encoder}</div>
               
              </div>
              <div className="price-cell">
                <div>{item.activity_type}</div>
             
              </div>
              <div className="inventory-cell">
                <div>{item.date_performed}</div>
   
              </div>
              <div className="actions-cell">
                <button className="action-button view-button">
                  <span className="action-icon">
                    <AiOutlineEye size={18} />
                  </span>
                  <span>Revert</span>
                </button>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityReport;
