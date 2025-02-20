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
    localStorage.getItem("selectedLocation") || "all"
  );
  const [data, setData] = useState([]);

  // Update localStorage when the location changes
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

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
    // Handle form submission here
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

      {/* Action Panel */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">ADD NEW ITEM</h2>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Left side - Image Upload */}
              <div className="image-upload-container">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-text">Click to upload image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.files[0],
                        }))
                      }
                      className="file-input"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="upload-button">
                      Browse
                    </label>
                  </div>
                )}
              </div>

              {/* Right side - Form Fields */}
              <div className="form-fields-container">
                <div className="form-group full-width">
                  <label className="form-label">ITEM CODE</label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ITEM BRAND</label>
                  <select
                    name="itemBrand"
                    value={formData.itemBrand}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Brand</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ITEM CATEGORY</label>
                  <select
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">DESCRIPTION 1</label>
                  <input
                    type="text"
                    name="description1"
                    value={formData.description1}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">DESCRIPTION 2</label>
                  <input
                    type="text"
                    name="description2"
                    value={formData.description2}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="price-units-container">
                  <div className="form-group">
                    <label className="form-label">ITEM UNITS</label>
                    <input
                      type="number"
                      name="units"
                      value={formData.units}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">FIXED PRICE</label>
                    <input
                      type="number"
                      name="fixedPrice"
                      value={formData.fixedPrice}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">RETAIL PRICE</label>
                    <input
                      type="number"
                      name="retailPrice"
                      value={formData.retailPrice}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">LOCATION</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Location</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">STORAGE AREA</label>
                  <select
                    name="storageArea"
                    value={formData.storageArea}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Storage Area</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="modal-actions">
              <button type="submit" className="save-button">
                SAVE
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="inventory-table">
        {/* Rest of your existing table code... */}
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
          {filteredInventory.map((item) => (
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
