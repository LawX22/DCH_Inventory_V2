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
import axios from "axios";

import InventoryModal from "../modals/InventoryModal";

function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: "",
    itemBrand: "",
    itemCategory: "",
    description1: "",
    description2: "",
    units: "",
    fixedPrice: "",
    retailPrice: "",
    location: "",
    storageArea: "",
    image: null,
  });

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );
  const [data, setData] = useState([]);

  // Update localStorage when the location changes
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

  //FIX THE BUG WHERE IT DOOES NOT LOAD INITIAL

  useEffect(() => {
    axios.get("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php", {
      params: { location: selectedLocation, search: searchQuery },
    })
    .then((response) => {
      console.log(response.data); // Inspect what the API returns
      setInventory(response.data.inventory || response.data);
    })
    .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery]); // Re-run when searchQuery changes
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsModalOpen(false);
  };


  const filteredInventory = inventory.filter((item) => 
    (item.itemCode && item.itemCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.itemBrand && item.itemBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.itemDesc_1 && item.itemDesc_1.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.itemDesc_2 && item.itemDesc_2.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  

  return (
    <div className="inventory-container">
      <Header />

      <div className="action-panel">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <AiOutlinePlus size={18} />
          <span>Add New Item</span>
        </button>

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

        <button className="export-button">
          <FiDownload size={18} />
          <span>Export</span>
        </button>

        <button className="activity-button">
          <FiActivity size={18} />
          <span>
            <a href="/activity" target="_blank" rel="noopener noreferrer">
              Activity
            </a>
          </span>
        </button>
      </div>

      <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell with-arrow">
            <span>Item</span>
            <AiOutlineDown size={10} />
          </div>
          <div className="header-cell with-arrow">
            <span>Brand</span>
            <AiOutlineDown size={10} />
          </div>
          <div className="header-cell with-arrow">
            <span>Location</span>
            <AiOutlineDown size={10} />
          </div>
          <div className="header-cell with-arrow">
            <span>Price</span>
            <AiOutlineDown size={10} />
          </div>
          <div className="header-cell with-arrow">
            <span>Inventory</span>
            <AiOutlineDown size={10} />
          </div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {filteredInventory.map((item) => (
            <div className="table-row" key={item.inventory_id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <img
                    src={`/src/backend/${item.image}`}
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
                  <AiOutlineEye size={18} />
                  <span>View</span>
                </button>
                <button className="action-button delete-button">
                  <AiOutlineDelete size={18} />
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
