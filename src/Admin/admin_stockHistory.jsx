import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineUndo } from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./admin_Header";
import axios from "axios";

function StockHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);

  const [category, setCategory] = useState(
    localStorage.getItem("categorySH") || ""
  );

  const [brand, setBrand] = useState(localStorage.getItem("brandSH") || "");

  const [area, setArea] = useState(localStorage.getItem("areaSH") || "");

  const [date, setDate] = useState(localStorage.getItem("dateSH") || "");

  const [activity, setActivity] = useState(
    localStorage.getItem("activitySH") || ""
  );

  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [areaList, setAreaList] = useState([]);

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

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
    localStorage.setItem("brandSH", brand);
    localStorage.setItem("areaSH", area);
    localStorage.setItem("categorySH", category);
    localStorage.setItem("dateSH", date);
    localStorage.setItem("activitySH", activity);
  }, [selectedLocation, brand, area, category, date, activity]);

  useEffect(() => {
    axios
      .get(
        "http://localhost/DCH_Inventory_V2/src/backend/load_stockHistory.php",
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

  return (
    <div className="adm-inventory-container">
      <Header />
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
            Date
            <span className="adm-date-input-container">
              <input
                type="date"
                name="date"
                onChange={(e) => setDate(e.target.value)}
                className="adm-styled-date-input"
              />
            </span>
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
              <FaChevronDown className="adm-select-icon" />{" "}
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
              <FaChevronDown className="adm-select-icon" />{" "}
            </div>
          </div>

          {/* Activity Dropdown */}
          <div className="adm-header-cell adm-with-arrow">
            <div className="adm-select-container">
              <select
                name="activity"
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="">Activity</option>
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
              <FaChevronDown className="adm-select-icon" />{" "}
            </div>
          </div>

          <div className="adm-header-cell adm-with-arrow">
            <span>Amount</span>
          </div>

          <div className="adm-header-cell adm-with-arrow">
            <span>Units</span>
          </div>

          <div className="adm-header-cell adm-with-arrow">
            <span>Requistion #</span>
          </div>

          <div className="adm-header-cell">Actions</div>
        </div>

        <div className="adm-table-body">
          {inventory.map((item) => (
            <div className="adm-table-row" key={item.stock_history_id}>
              <div className="adm-item-cell">
                <div className="adm-item-image-container">
                  <img
                    src={"/src/assets/" + item.image}
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
                {new Date(item.transaction_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="adm-brand-cell">
                <div>{item.brand}</div>
              </div>
              <div className="adm-location-cell">
                <div>{item.location}</div>
              </div>
              <div className="adm-activity-cell">
                <div>{item.transaction_type}</div>
              </div>

              <div className="adm-amount-cell">
                <div>{item.units_added}</div>
              </div>

              <div className="adm-units-cell">
                <div className="adm-item">
                  <div>Current - {item.current_stock}</div>
                  <div>Previous - {item.previous_units}</div>
                </div>
              </div>

              <div className="adm-Requistion-cell">
                <div className="adm-item">
                  <div>Stock - {item.requisition_number}</div>
                </div>
              </div>

              <div className="adm-actions-cell">
                <button className="adm-action-button adm-view-button">
                  <span className="adm-action-icon">
                    <AiOutlineUndo size={18} />
                  </span>
                  <span>Undo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockHistory;