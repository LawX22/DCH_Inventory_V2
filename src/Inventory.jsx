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

function Inventory() {
  const [selectedWarehouse] = useState("Warehouse");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField] = useState("");

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

  return (
    <div className="inventory-container">
      {/* Header with navigation */}
      <Header />

      {/* Action panel */}
      <div className="action-panel">
        <button className="add-button">
          <AiOutlinePlus size={18} />
          <span>Add New Item</span>
        </button>

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

      {/* Inventory table */}
      <div className="inventory-table">
        <div className="table-header">
          <div
            className={`header-cell with-arrow ${
              sortField === "item" ? "sorted" : ""
            }`}
            onClick={() => handleSort("item")}
          >
            <span>
              Item <AiOutlineDown size={12} style={{ margin: "0 0 0 12" }}/>{" "}
            </span>
          </div>
          <div
            className={`header-cell with-arrow ${
              sortField === "brand" ? "sorted" : ""
            }`}
            onClick={() => handleSort("brand")}
          >
            <span>
              Brand <AiOutlineDown size={12} style={{ margin: "0 0 0 12" }}/>{" "}
            </span>
          </div>
          <div
            className={`header-cell with-arrow ${
              sortField === "location" ? "sorted" : ""
            }`}
            onClick={() => handleSort("location")}
          >
            <span>
              Location <AiOutlineDown size={12} style={{ margin: "0 0 0 12" }}/>
            </span>
          </div>
          <div
            className={`header-cell ${sortField === "price" ? "sorted" : ""}`}
            onClick={() => handleSort("price")}
          >
            Price
          </div>
          <div
            className={`header-cell ${
              sortField === "inventory" ? "sorted" : ""
            }`}
            onClick={() => handleSort("inventory")}
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
                <button className="action-button view-button">
                  <span className="action-icon">
                    <AiOutlineEye size={18} />
                  </span>
                  <span>View</span>
                </button>
                <button className="action-button delete-button">
                  <span className="action-icon">
                    <AiOutlineDelete size={18} />
                  </span>
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
