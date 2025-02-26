import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlineInbox,
  AiOutlineExport,
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

  const [category, setCategory] = useState("");
    const [brand, setBrand] = useState('');
    const [area, setArea] = useState('');
  
    const [categoryList, setCategoryList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [areaList, setAreaList] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );

  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php", {
        params: { location: selectedLocation, search: searchQuery, category:category, brand:brand, area:area },
      })
      .then((response) => {
        setInventory(response.data.inventory || response.data);
        console.log(area);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery, category, brand, area]); // Fixed dependency array
   // Re-run when searchQuery changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function openStockinFunc(data) {
    setSelectedData(data);
    setStockInModalOpen(true);
  }

  function openStockoutFunc(data) {
    setSelectedData(data);
    setStockOutModalOpen(true);
  }



  
  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_category_header.php")
      .then((response) => {
        setCategoryList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_brands_header.php")
      .then((response) => {
        setBrandList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_area_header.php")
      .then((response) => {
        setAreaList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
  
    switch (name) {
      case "category":
        setCategory(value);
  
        break;
      case "brand":
        setBrand(value);
  
        break;
      case "area":
        setArea(value);
  
        break;
      default:
        console.warn("Unknown filter:", name);
    }
  };
  



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
           <select name="category" onChange={handleFilterChange}> 
           
                       <option value="">Item</option>
                   {categoryList.map((option) => (
                     <option key={option.inventory_Id} value={option.category}>
                       {option.category}
                     </option>
                   ))}
                       </select>
           
                      
                       <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
                     </div>
                     <div className="header-cell with-arrow">
                      
                       <select name="brand" onChange={handleFilterChange}>  
           
                       <option value="">Brand</option>
                       {brandList.map((option) => (
                       <option key={option.inventory_Id} value={option.brand}>
                       {option.brand}
                       </option>
                       ))}
                       </select>
           
                       <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
                     </div>
                     <div className="header-cell with-arrow">
                       <select name="area" onChange={handleFilterChange}>
                       <option value="">Area</option>
                       {areaList.map((option) => (
                       <option key={option.inventory_Id} value={option.storage_area}>
                       {option.storage_area}
                       </option>
                       ))}
                       </select>
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
                    src={"/src/backend/" + item.image}
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
              <div className="brand-cell">
                <div className="item">{item.brand}</div>
              </div>
              <div className="location-cell">
                <div className="item">
                  <div>{item.location}</div>
                  <div>{item.storage_area}</div>
                </div>
              </div>
              <div className="price-cell">
                <div className="item">
                  <div>Price - ₱ {item.price}</div>
                  <div>Retail - ₱ {item.retail_price}</div>
                </div>
              </div>
              <div className="inventory-cell">
                <div className="item">
                  <div>Stock - {item.units}</div>
                  <div>TSV - ₱ {item.totalstockValue}</div>
                </div>
              </div>

              <div className="actions-cell">
                <button
                  className="action-button view-button"
                  onClick={() => openStockinFunc(item)}
                >
                  <span className="action-icon">
                    <AiOutlineInbox size={18} />
                  </span>
                  <span>Stock In</span>
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => openStockoutFunc(item)}
                >
                  <span className="action-icon">
                    <AiOutlineExport size={18} />
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
