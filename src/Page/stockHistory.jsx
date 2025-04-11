import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineUndo, AiOutlinePlus } from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import Header from "./Header";
import axios from "axios";
import StockHistoryFixModal from "../modals/stockHistory_Fix_Modal";

function StockHistory() {
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
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_brands_header.php"
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
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_area_header.php")
      .then((response) => {
        setAreaList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);




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
    return type === "Stock In" ? "activity-in" : "activity-out";
  };

  return (
    <div className="inventory-container">
      <Header />

      <StockHistoryFixModal
        isOpen={historyFixIsOpen}
        onClose={() => setHistoryFixIsOpen(false)}
        data={selectedData}
      />

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

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell">
            <div className="select-container">
              <select
                name="category"
                value={category}
                onChange={handleFilterChange}
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
          <div className="header-cell date-cell">
            <div className="date-input-wrapper">
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleFilterChange}
                className="styled-date-input enhanced-select"
              />
            </div>
          </div>
          <div className="header-cell with-arrow">
            <div className="select-container">
              <select
                name="brand"
                value={brand}
                onChange={handleFilterChange}
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
                value={area}
                onChange={handleFilterChange}
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

          {/* Activity Dropdown */}
          <div className="header-cell with-arrow">
            <div className="select-container">
              <select
                name="activity"
                value={activity}
                onChange={handleFilterChange}
                className="enhanced-select"
              >
                <option value="">Activity</option>
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>

          <div className="header-cell">
            <span>Amount</span>
          </div>

          <div className="header-cell">
            <span>Units</span>
          </div>

          <div className="header-cell">
            <span>Requisition #</span>
          </div>

          <div className="header-cell" style={{ justifyContent: "center" }}>
            Actions
          </div>
        </div>

        <div className="table-body">
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <div className="table-row" key={item.stock_history_id}>
                <div className="item-cell">
                  <div className="item-image-container">
                    <img
                      src={"/src/backend/" + item.image}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.stock_name}</div>
                    <div className="item-category">{item.category}</div>
                    <div className="item-id">{item.itemCode}</div>
                  </div>
                </div>

                <div className="date-cell">
                  <div className="item">
                    <div>{formatDate(item.transaction_date)}</div>
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

                <div className="activity-cell">
                  <div
                    className={`activity-tag ${getActivityClass(item.transaction_type)}`}
                  >
                    {item.transaction_type}
                  </div>
                </div>

                <div className="price-cell">
                  <div className="item">
                    <div>{item.units_added}</div>
                  </div>
                </div>

                <div className="inventory-cell">
                  <div className="item">
                    <div>Current: {item.current_stock}</div>
                    <div>Previous: {item.previous_units}</div>
                  </div>
                </div>

                <div className="requisition-cell">
                  <div className="item">
                    <div>Stock - {item.requisition_number}</div>
                  </div>
                </div>

                <div className="actions-cell">
                  <div className="action-buttons-container">
                    <button
                      className="action-button view-button"
                      onClick={() => openHistoryFixFunc(item)}
                      title="Fix"
                    >
                      <span className="action-icon">
                        <AiOutlineUndo size={16} />
                      </span>
                      <span className="action-text">Fix</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">No stock history found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockHistory;
