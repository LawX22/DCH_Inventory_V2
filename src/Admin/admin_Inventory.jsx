import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./admin_Header";
import axios from "axios";

import StockHistoryModal from "../modals/focusedStockHistory_Modal";
import EditModal from "../modals/edit_InventoryModal";

function Inventory() {
  const [editModalOpen, seteditModalOpen] = useState(false);

  const [category, setCategory] = useState(
    localStorage.getItem("category") || ""
  );

  const [brand, setBrand] = useState(localStorage.getItem("brand") || "");

  const [area, setArea] = useState(localStorage.getItem("area") || "");

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
  }, [selectedLocation, brand, area, category]);

  //FIX THE BUG WHERE IT DOOES NOT LOAD INITIAL

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php", {
        params: {
          location: selectedLocation,
          search: searchQuery,
          category: category,
          brand: brand,
          area: area,
        },
      })
      .then((response) => {
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery, inventory]); // Re-run when searchQuery changes

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
        "http://localhost/DCH_Inventory_V2/src/backend/delete_inventory.php",
        new URLSearchParams({
          id: id,
          username: username, // Add username here
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
      "http://localhost/DCH_Inventory_V2/src/backend/export_inventory.php",
      "_blank"
    );
  };

  useEffect(() => {
    localStorage.setItem("brand", ""); // Set brand to empty string (or any value you want)
    localStorage.setItem("area", ""); // Set area to empty string
    localStorage.setItem("category", ""); // Set category to empty string
  }, []);

  useEffect(() => {
    axios
      .get(
        "http://localhost/DCH_Inventory_V2/src/backend/list_category_header.php"
      )
      .then((response) => {
        setCategoryList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "http://localhost/DCH_Inventory_V2/src/backend/list_brands_header.php"
      )
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

  return (
    <div className="adm-inventory-container">
      <Header />

      <div className="adm-action-panel">
        <button className="adm-add-button" onClick={() => setIsModalOpen(true)}>
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
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categoryList.map((option) => (
                  <option key={option.category} value={option.category}>
                    {option.category}
                  </option>
                ))}
              </select>
              <FaChevronDown className="adm-select-icon" />
            </div>
          </div>
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select name="brand" onChange={(e) => setBrand(e.target.value)}>
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
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select name="area" onChange={(e) => setArea(e.target.value)}>
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
          <div className="adm-header-cell adm-with-arrow">
            <span>Price</span>
          </div>
          <div className="adm-header-cell adm-with-arrow">
            <span>Inventory</span>
          </div>
          <div className="adm-header-cell">Actions</div>
        </div>

        <div className="adm-table-body">
          {filteredInventory.map((item, key) => (
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
                  <div className="adm-item-name">
                    {item.itemDesc_1 + " " + item.itemDesc_2}
                  </div>
                  <div className="adm-item-category">{item.category}</div>
                  <div className="adm-item-id">{item.itemCode}</div>
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
                <button
                  className="adm-action-button adm-view-button"
                  onClick={() => openEditFunc(item)}
                >
                  <AiOutlineEye size={18} />
                  <span>Details</span>
                </button>

                <button
                  className="adm-action-button adm-delete-button"
                  onClick={() => openModal(item.inventory_Id)}
                 
                >
                  <AiOutlineDelete size={18} />
                  <span>History</span>
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