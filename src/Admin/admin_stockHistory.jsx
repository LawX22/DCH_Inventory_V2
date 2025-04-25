import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineUndo, AiOutlinePlus } from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import Header from "./admin_Header";
import axios from "axios";
import StockHistoryFixModal from "../modals/stockHistory_Fix_Modal";

function AdminStockHistory() {
  // Search and data states
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [historyFixIsOpen, setHistoryFixIsOpen] = useState(false);

  // Filter states - initialize from localStorage
  const [category, setCategory] = useState(
    localStorage.getItem("categorySH") || ""
  );
  const [brand, setBrand] = useState(localStorage.getItem("brandSH") || "");
  const [area, setArea] = useState(localStorage.getItem("areaSH") || "");
  const [date, setDate] = useState(localStorage.getItem("dateSH") || "");
  const [activity, setActivity] = useState(
    localStorage.getItem("activitySH") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );

  // Option lists for filters
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [areaList, setAreaList] = useState([]);

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.setItem("brandSH", "");
    localStorage.setItem("areaSH", "");
    localStorage.setItem("dateSH", "");
    localStorage.setItem("categorySH", "");
    localStorage.setItem("activitySH", "");

    setBrand("");
    setArea("");
    setDate("");
    setCategory("");
    setActivity("");
  }, []);

  // Handler for filter changes
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
      case "date":
        setDate(value);
        break;
      case "activity":
        setActivity(value);
        break;
      default:
        console.warn("Unknown filter:", name);
    }
  };

  // Fetch filter options
  useEffect(() => {
    axios
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_category_header.php"
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
  

  // Update localStorage when filters change
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
    localStorage.setItem("brandSH", brand);
    localStorage.setItem("areaSH", area);
    localStorage.setItem("categorySH", category);
    localStorage.setItem("dateSH", date);
    localStorage.setItem("activitySH", activity);
  }, [selectedLocation, brand, area, category, date, activity]);

  // Fetch inventory data when filters change
  useEffect(() => {
    axios
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/load_stockHistory.php",
        {
          params: {
            location: selectedLocation,
            search: searchQuery,
            category: category,
            brand: brand,
            area: area,
            date: date,
            activity: activity,
          },
        }
      )
      .then((response) => setInventory(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));
    console.log(activity);
  }, [selectedLocation, activity, category, brand, area, date, searchQuery]);

  // Open fix modal with selected data
  function openHistoryFixFunc(data) {
    setSelectedData(data);
    setHistoryFixIsOpen(true);
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get activity class based on transaction type
  const getActivityClass = (type) => {
    return type === "Stock In" ? "adm-activity-in" : "adm-activity-out";
  };

  return (
    <div className="adm-inventory-container">
      <Header />

      <StockHistoryFixModal
        isOpen={historyFixIsOpen}
        onClose={() => setHistoryFixIsOpen(false)}
        data={selectedData}
      />

      {/* Action Panel */}
      <div className="adm-action-panel">
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

        {/* Export Button */}
        <button className="adm-export-button">
          <FiDownload size={18} />
          <span>Export</span>
        </button>

        {/* Activity Button */}
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

      {/* Inventory Table */}
      <div className="adm-inventory-table">
        <div className="adm-table-header">
          <div className="adm-header-cell">
            <div className="adm-select-container">
              <select
                name="category"
                value={category}
                onChange={handleFilterChange}
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
          <div className="adm-header-cell adm-date-cell">
            <div className="adm-date-input-wrapper">
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleFilterChange}
                className="adm-styled-date-input adm-enhanced-select"
              />
            </div>
          </div>
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select
                name="brand"
                value={brand}
                onChange={handleFilterChange}
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
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select
                name="area"
                value={area}
                onChange={handleFilterChange}
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

          {/* Activity Dropdown */}
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select
                name="activity"
                value={activity}
                onChange={handleFilterChange}
                className="adm-enhanced-select"
              >
                <option value="">Activity</option>
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
              <FaChevronDown className="adm-select-icon" />
            </div>
          </div>

          <div className="adm-header-cell">
            <span>Amount</span>
          </div>

          <div className="adm-header-cell">
            <span>Units</span>
          </div>

          <div className="adm-header-cell">
            <span>Requisition #</span>
          </div>

          <div className="adm-header-cell" style={{ justifyContent: "center" }}>
            Actions
          </div>
        </div>

        <div className="adm-table-body">
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <div className="adm-table-row" key={item.stock_history_id}>
                <div className="adm-item-cell">
                  <div className="adm-item-image-container">
                    <img
                      src={"/src/backend/" + item.image}
                      alt={item.name}
                      className="adm-item-image"
                    />
                  </div>
                  <div className="adm-item-details">
                    <div className="adm-item-name">{item.stock_name}</div>
                    <div className="adm-item-category">{item.category}</div>
                    <div className="adm-item-id">{item.itemCode}</div>
                  </div>
                </div>

                <div className="adm-date-cell">
                  <div className="adm-item">
                    <div>{formatDate(item.transaction_date)}</div>
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

                <div className="adm-activity-cell">
                  <div
                    className={`adm-activity-tag ${getActivityClass(item.transaction_type)}`}
                  >
                    {item.transaction_type}
                  </div>
                </div>

                <div className="adm-price-cell">
                  <div className="adm-item">
                    <div>{item.units_added}</div>
                  </div>
                </div>

                <div className="adm-inventory-cell">
                  <div className="adm-item">
                    <div>Current: {item.current_stock}</div>
                    <div>Previous: {item.previous_units}</div>
                  </div>
                </div>

                <div className="adm-requisition-cell">
                  <div className="adm-item">
                    <div>Stock - {item.requisition_number}</div>
                  </div>
                </div>

                <div className="adm-actions-cell">
                  <div className="adm-action-buttons-container">
                    <button
                      className="adm-action-button adm-view-button"
                      onClick={() => openHistoryFixFunc(item)}
                      title="Fix"
                    >
                      <span className="adm-action-icon">
                        <AiOutlineUndo size={16} />
                      </span>
                      <span className="adm-action-text">Fix</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="adm-no-data-message">No stock history found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStockHistory;