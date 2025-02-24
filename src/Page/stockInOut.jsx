import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineDown,
} from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./Header";
import axios from "axios";
import StockInModal from "../modals/stockIn_modal";
import StockOutModal from "../modals/stockOut_modal";

import { FaBullseye } from "react-icons/fa6";


function StockInOut() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [stockInModalOpen, setStockInModalOpen] = useState(false);
  const [stockOutModalOpen, setStockOutModalOpen] = useState(false);



  const [selectedLocation, setSelectedLocation] = useState(
      localStorage.getItem("selectedLocation") || "All"
    );

     useEffect(() => {
        localStorage.setItem("selectedLocation", selectedLocation);
      }, [selectedLocation]);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php", {
        params: { location: selectedLocation, search: searchQuery },
      })
      .then((response) => {
        console.log(response.data); // Inspect what the API returns
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery]);


  function openStockinFunc(data){
    setSelectedData(data)
    setStockInModalOpen(true);
  }

  function openStockoutFunc(data){
    setSelectedData(data)
    setStockOutModalOpen(true);
  }


  return (
    <div className="inventory-container">
      <Header />

      {/* Action Panel */}
      <div className="action-panel">
        <div className="warehouse-dropdown">
          <select
            className="dropdown-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Store">Store</option>
          </select>
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
        <button
          className="activity-button"
          onClick={() =>
            window.open("/activity", "_blank", "noopener,noreferrer")
          }
        >
          <FiActivity size={18} />
          <span>Activity</span>
        </button>
      </div>


      <StockInModal
        isOpen={stockInModalOpen}
        onClose={() => setStockInModalOpen(false)}
        data={selectedData}
        
      />

      <StockOutModal
        isOpen={stockOutModalOpen}
        onClose={() => setStockOutModalOpen(false)}
        data={selectedData}
        
      />
      

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell with-arrow">
            <span>Item</span>
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
            <span>Price</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Inventory</span>
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
              <button className="action-button view-button" onClick={() => openStockinFunc(item)}>

                  <span className="action-icon">
                    <AiOutlineEye size={18} />
                  </span>
                  <span>Stock In</span>
                </button>
                <button className="action-button delete-button" onClick={() => openStockoutFunc(item)}>
                  <span className="action-icon">
                    <AiOutlineDelete size={18} />
                  </span>
                  <span>Stock out</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockInOut;
