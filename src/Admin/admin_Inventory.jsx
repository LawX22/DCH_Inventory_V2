import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiDownload, FiActivity, FiList } from "react-icons/fi";
import Header from "./admin_Header";
import axios from "axios";

import StockHistoryModal from "../modals/focusedStockHistory_Modal";
import EditModal from "../modals/edit_InventoryModal";

function AdminInventory() {
  const [editModalOpen, seteditModalOpen] = useState(false);

  const [category, setCategory] = useState(
    localStorage.getItem("category") || ""
  );

  const [brand, setBrand] = useState(localStorage.getItem("brand") || "");

  const [area, setArea] = useState(localStorage.getItem("area") || "");
  
  const [stock, setStock] = useState(localStorage.getItem("stock") || "");

  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [areaList, setAreaList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const user = localStorage.getItem("username");

  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
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

  const openModal = (inventory_Id) => {
    setSelectedInventoryId(inventory_Id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInventoryId(null);
  };

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );

  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Unknown"
  );
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  // Update localStorage when the location changes
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
    localStorage.setItem("brand", brand);
    localStorage.setItem("area", area);
    localStorage.setItem("category", category);
    localStorage.setItem("stock", stock);
  }, [selectedLocation, brand, area, category, stock]);

  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/load_Inventory.php", {
        params: {
          location: selectedLocation,
          search: searchQuery,
          category: category,
          brand: brand,
          area: area,
          stock: stock,
        },
      })
      .then((response) => {
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery, inventory, brand, category, area, stock]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "category":
        setCategory(value);
        break;
      case "brand":
        setBrand(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "area":
        setArea(value);
        break;
      default:
        console.warn("Unknown filter:", name);
    }
  };

  function openEditFunc(data) {
    setSelectedData(data);
    seteditModalOpen(true);
  }

  async function deleteFunc(id, username) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!isConfirmed) return; // Stop if the user cancels

    try {
      await axios.post(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/delete_inventory.php",
        new URLSearchParams({
          id: id,
          username: username,
        })
      );

      console.log("Deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsModalOpen(false);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      (item.itemCode &&
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemBrand &&
        item.itemBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemDesc_1 &&
        item.itemDesc_1.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemDesc_2 &&
        item.itemDesc_2.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = () => {
    window.open(
      "https://slategrey-stingray-471759.hostingersite.com/api/backend/export_inventory.php",
      "_blank"
    );
  };

  useEffect(() => {
    localStorage.setItem("brand", "");
    localStorage.setItem("area", "");
    localStorage.setItem("category", "");
    localStorage.setItem("stock", "");
    
    setCategory("");
    setBrand("");
    setArea("");
    setStock("");
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_category_header.php"
      )
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_brands_header.php"
      )
      .then((response) => {
        setBrandList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);
  
  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_area_header.php")
      .then((response) => {
        setAreaList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [inventoryNumber, setInventoryNumber] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleStockChange = (e) => {
    // Ensure only numbers are allowed
    const value = e.target.value.replace(/\D/, "");
    setInventoryNumber(value);
    setStock(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <div className="adm-inventory-container">
      <Header />

      <div className="adm-action-panel">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <AiOutlinePlus size={18} />
          <span>Add New Item</span>
        </button>

        <div className="adm-warehouse-dropdown">
          <select
            className="adm-dropdown-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Store">Store</option>
          </select>
        </div>

        <div className="adm-search-container">
          <AiOutlineSearch size={18} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search something..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="adm-list-button"
          onClick={() =>
            window.open("/List_Restock", "_blank", "noopener,noreferrer")
          }
        >
          <FiList size={18} />
          <span>List Stocks</span>
        </button>

        <button className="adm-export-button" onClick={handleExport}>
          <FiDownload size={18} />
          <span>Export</span>
        </button>

        <button
          className="adm-activity-button"
          onClick={() =>
            window.open("/activity", "_blank", "noopener,noreferrer")
          }
        >
          <FiActivity size={18} />
          <span>Activity</span>
        </button>
      </div>

      <StockHistoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        inventory_Id={selectedInventoryId}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => seteditModalOpen(false)}
        data={selectedData}
      />

      <div className="adm-inventory-table">
        <div className="adm-table-header">
          <div className="adm-header-cell">
            <div className="adm-select-container">
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="adm-enhanced-select"
              >
                <option value="">Select Category & Item Code</option>
                {categoryList.map((option) => (
                  <option key={option.category} value={option.category}>
                    {option.category}
                  </option>
                ))}
              </select>
              <FaChevronDown className="adm-select-icon" />
            </div>
          </div>
          <div className="adm-header-cell">
            <span>Description 1 & 2</span>
          </div>
          <div className="adm-header-cell">
            <span>Description 3 & 4</span>
          </div>
          <div className="adm-header-cell">
            <div className="adm-select-container">
              <select
                name="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="adm-enhanced-select"
              >
                <option value="">Brand</option>
                {brandList.map((option) => (
                  <option key={option.inventory_Id} value={option.brand}>
                    {option.brand}
                  </option>
                ))}
              </select>
              <FaChevronDown className="adm-select-icon" />
            </div>
          </div>
          <div className="adm-header-cell">
            <div className="adm-select-container">
              <select
                name="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="adm-enhanced-select"
              >
                <option value="">Area</option>
                {areaList.map((option) => (
                  <option key={option.inventory_Id} value={option.storage_area}>
                    {option.storage_area}
                  </option>
                ))}
              </select>
              <FaChevronDown className="adm-select-icon" />
            </div>
          </div>
          <div className="adm-header-cell">
            <span>Price</span>
          </div>
          <div className="adm-header-cell" onClick={handleEdit}>
            {isEditing ? (
              <input
                type="text"
                value={inventoryNumber}
                onChange={handleStockChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                autoFocus
                className="adm-inventory-input"
              />
            ) : (
              <span>{inventoryNumber || "Inventory"}</span>
            )}
          </div>
          <div className="adm-header-cell" style={{ justifyContent: "center" }}>
            Actions
          </div>
        </div>

        <div className="adm-table-body">
          {filteredInventory.map((item) => (
            <div className="adm-table-row" key={item.inventory_id}>
              <div className="adm-item-cell">
                <div className="adm-item-image-container">
                  <img
                    src={`/src/backend/${item.image}`}
                    alt={item.name}
                    className="adm-item-image"
                  />
                </div>
                <div className="adm-item-details">
                  <div className="adm-item-category">{item.category}</div>
                  <div className="adm-item-id">{item.itemCode}</div>
                </div>
              </div>
              <div className="adm-brand-cell">
                <div className="adm-item">
                  <div>{item.itemDesc_1 || "-"}</div>
                  <div>{item.itemDesc_2 || "-"}</div>
                </div>
              </div>
              <div className="adm-brand-cell">
                <div className="adm-item">
                  <div>{item.itemDesc_1 || "-"}</div>
                  <div>{item.itemDesc_2 || "-"}</div>
                </div>
              </div>
              <div className="adm-brand-cell">
                <div className="adm-item">{item.brand}</div>
              </div>
              <div className="adm-location-cell">
                <div className="adm-item">
                  <div>{item.location}</div>
                  <div>{item.storage_area}</div>
                </div>
              </div>
              <div className="adm-price-cell">
                <div className="adm-item">
                  <div>Price - ₱ {item.price}</div>
                  <div>Retail - ₱ {item.retail_price}</div>
                </div>
              </div>
              <div className="adm-inventory-cell">
                <div className="adm-item">
                  <div>Stock - {item.units}</div>
                  <div>TSV - ₱ {item.totalstockValue}</div>
                </div>
              </div>
              <div className="adm-actions-cell">
                <div className="adm-action-buttons-container">
                  <button
                    className="adm-action-button adm-view-button"
                    onClick={() => openEditFunc(item)}
                    title="Edit"
                  >
                    <span className="adm-action-icon">
                      <AiOutlineEye size={16} />
                    </span>
                    <span className="adm-action-text">Edit</span>
                  </button>

                  <button
                    className="adm-action-button adm-delete-button"
                    onClick={() => openModal(item.inventory_Id)}
                    title="History"
                  >
                    <span className="adm-action-icon">
                      <AiOutlineDelete size={16} />
                    </span>
                    <span className="adm-action-text">History</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminInventory;  