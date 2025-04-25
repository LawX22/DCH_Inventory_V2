import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  AiOutlineSearch,
  AiOutlineInbox,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineTeam,
} from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./Header";
import axios from "axios";
import StockInModal from "../modals/stockIn_modal";
import StockOutModal from "../modals/stockOut_modal";
import GroupModal from "../modals/GroupModal"; 

function StockInOut() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [stockInModalOpen, setStockInModalOpen] = useState(false);
  const [stockOutModalOpen, setStockOutModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false); // New state for GroupModal

  const [category, setCategory] = useState(
    localStorage.getItem("category") || ""
  );

  const [brand, setBrand] = useState(localStorage.getItem("brand") || "");

  const [area, setArea] = useState(localStorage.getItem("area") || "");

  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [groupData, setGroupData] = useState([]); 

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );

  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
    localStorage.setItem("brand", brand);
    localStorage.setItem("area", area);
    localStorage.setItem("category", category);
  }, [selectedLocation, brand, area, category]);

  useEffect(() => {
    localStorage.setItem("brand", ""); // Set brand to empty string (or any value you want)
    localStorage.setItem("area", ""); // Set area to empty string
    localStorage.setItem("category", ""); // Set category to empty string

    setCategory("");
    setBrand("");
    setArea("");
  }, []);

  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/load_Inventory.php", {
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
        console.log(area);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery, inventory, brand, category, area]); 



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
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_category_header.php"
        , {
          params: { brand , selectedLocation}
        }
      )
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [brand, selectedLocation]);

  useEffect(() => {
  // skip if no category selected yet
  
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_brands_header.php", {
        params: { category , selectedLocation}
      })
      .then((response) => {
        setBrandList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, [category, selectedLocation]);

  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_area_header.php"
      )
      .then((response) => {
        setAreaList(response.data); // Store fetched areas in state
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  const addToGroup = async (inventoryId) => {
    const username = localStorage.getItem("username");
    console.log(username);

    try {
      const response = await fetch(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/selected_stock_group.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            inventory_Id: inventoryId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Added to group successfully!");
      } else {
        alert("Failed to add to group.");
      }
    } catch (error) {
      console.error("Error adding to group:", error);
    }
  };

  const fetchGroupData = async () => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/getStockGroup.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const openGroupModal = () => {
    fetchGroupData();
    setGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setGroupModalOpen(false);
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

        <button className="showGroupModal-button" onClick={openGroupModal}>
          <span className="action-icon">
            <AiOutlineTeam size={18} />
          </span>
          <span>See Group</span>
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

      {/* Modals */}
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

      {/* New Group Modal */}
      <GroupModal
        isOpen={groupModalOpen}
        onClose={closeGroupModal}
        groupData={groupData}
      />

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell">
            <div className="select-container">
              <select
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="enhanced-select"
              >
                <option value="">Select Category & Item Code</option>
                {categoryList.map((option) => (
                  <option key={option.category} value={option.category}>
                    {option.category}
                  </option>
                ))}
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          <div className="header-cell">
            <span>Description 1 & 2</span>
          </div>
          <div className="header-cell">
            <span>Description 3 & 4</span>
          </div>
          <div className="header-cell with-arrow">
            <div className="select-container">
              <select
                name="brand"
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
                className="enhanced-select"
              >
                <option value="">Brand</option>
                {brandList.map((option) => (
                  <option key={option.inventory_Id} value={option.brand}>
                    {option.brand}
                  </option>
                ))}
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          <div className="header-cell with-arrow">
            <div className="select-container">
              <select
                name="area"
                onChange={(e) => setArea(e.target.value)}
                value={area}
                className="enhanced-select"
              >
                <option value="">Area</option>
                {areaList.map((option) => (
                  <option key={option.inventory_Id} value={option.storage_area}>
                    {option.storage_area}
                  </option>
                ))}
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          <div className="header-cell with-arrow">
            <span>Price</span>
          </div>
          <div className="header-cell with-arrow">
            <span>Inventory</span>
          </div>
          <div className="header-cell" style={{ justifyContent: "center" }}>Actions</div>
        </div>

        <div className="table-body">
          {inventory.map((item) => (
            <div className="table-row" key={item.inventory_Id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <img
                    src={"/src/backend/" + item.image}
                    alt={item.name}
                    className="item-image"
                  />
                </div>
                <div className="item-details">
                  <div className="item-category">{item.category}</div>
                  <div className="item-id">{item.itemCode}</div>
                </div>
              </div>
              <div className="brand-cell">
                <div className="item">
                  <div>{item.itemDesc_1 || "-"}</div>
                  <div>{item.itemDesc_2 || "-"}</div>
                </div>
              </div>
              <div className="brand-cell">
                <div className="item">
                  <div>{item.itemDesc_3 || "-"}</div>
                  <div>{item.itemDesc_4 || "-"}</div>
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
                  <div>TSV - ₱ {item.new_stock_id}</div>
                </div>
              </div>

              <div className="actions-cell">
                <div className="action-buttons-container">
                  <button
                    className="action-button view-button"
                    onClick={() => openStockinFunc(item)}
                    disabled={
                      (localStorage.getItem("userType") === "Store-Staff" &&
                        item.location !== "STORE") ||
                      (localStorage.getItem("userType") === "Warehouse-Staff" &&
                        item.location === "STORE")
                    }
                    title="Stock In"
                  >
                    <span className="action-icon">
                      <AiOutlineInbox size={16} />
                    </span>
                    <span className="action-text">Stock In</span>
                  </button>

                  <button
                    className="action-button delete-button"
                    onClick={() => openStockoutFunc(item)}
                    disabled={
                      (localStorage.getItem("userType") === "Store-Staff" &&
                        item.location !== "STORE") ||
                      (localStorage.getItem("userType") === "Warehouse-Staff" &&
                        item.location === "STORE")
                    }
                    title="Stock Out"
                  >
                    <span className="action-icon">
                      <AiOutlineExport size={16} />
                    </span>
                    <span className="action-text">Stock Out</span>
                  </button>

                  <button
                    className="action-button add-button"
                    onClick={() => addToGroup(item.inventory_Id)}
                    disabled={
                      (localStorage.getItem("userType") === "Store-Staff" &&
                        item.location !== "Store") ||
                      (localStorage.getItem("userType") === "Warehouse-Staff" &&
                        item.location === "Store")
                    }
                    title="Add Group"
                  >
                    <span className="action-icon">
                      <AiOutlinePlus size={16} />
                    </span>
                    <span className="action-text">Add Group</span>
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

export default StockInOut;