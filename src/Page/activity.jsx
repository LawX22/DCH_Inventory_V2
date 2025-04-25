import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DCHLogo from '../assets/DCH.png';
import axios from "axios";

function ActivityReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Keep track of which input is open
  const [dateInputOpen, setDateInputOpen] = useState(false);
  const [timeInputOpen, setTimeInputOpen] = useState(false);
  
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const [time, setTime] = useState(
    localStorage.getItem("timeAH") || ''
  );

  const [activityType, setActivityType] = useState(
    localStorage.getItem("activityTypeAH") || ''
  );
  
  const [date, setDate] = useState(
    localStorage.getItem("dateAH") || ''
  );
  
  const [user, setUser] = useState(
    localStorage.getItem("userAH") || ''
  );

  const [userList, setUserList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );
  
  const navigate = useNavigate();

  // Reset filters on mount
  useEffect(() => {
    localStorage.setItem("activityTypeAH", "");
    localStorage.setItem("dateAH", "");
    localStorage.setItem("userAH", "");
    localStorage.setItem("timeAH", "");
    
    setActivityType('');
    setDate('');
    setUser('');
    setTime('');
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close date picker if clicking outside
      if (dateInputRef.current && !dateInputRef.current.contains(event.target)) {
        setDateInputOpen(false);
      }
      
      // Close time picker if clicking outside
      if (timeInputRef.current && !timeInputRef.current.contains(event.target)) {
        setTimeInputOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom handlers for date/time inputs
  const handleDateClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Toggle date input open state
    setDateInputOpen(!dateInputOpen);
    // Close time input if open
    setTimeInputOpen(false);
    
    // Focus the input if opening
    if (!dateInputOpen) {
      setTimeout(() => {
        if (dateInputRef.current) {
          dateInputRef.current.showPicker();
        }
      }, 10);
    }
  };
  
  const handleTimeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Toggle time input open state
    setTimeInputOpen(!timeInputOpen);
    // Close date input if open
    setDateInputOpen(false);
    
    // Focus the input if opening
    if (!timeInputOpen) {
      setTimeout(() => {
        if (timeInputRef.current) {
          timeInputRef.current.showPicker();
        }
      }, 10);
    }
  };

  // Fetch user list
  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_encoders_header.php")
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Update localStorage when filter values change
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
    localStorage.setItem("activityTypeAH", activityType);
    localStorage.setItem("dateAH", date);
    localStorage.setItem("userAH", user);
    localStorage.setItem("timeAH", time);
  }, [selectedLocation, date, user, activityType, time]);

  // Fetch activity data
  useEffect(() => {
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/load_activityReport.php", {
        params: { 
          location: selectedLocation, 
          search: searchQuery, 
          user: user, 
          date: date, 
          activityType: activityType, 
          time: time
        },
      })
      .then((response) => {
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching activity data:", error));
  }, [selectedLocation, searchQuery, date, activityType, user, time]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
      case "users":
        setUser(value);
        break;
      case "date":
        setDate(value);
        setDateInputOpen(false); // Close the datepicker after selection
        break;
      case "time":
        setTime(value);
        setTimeInputOpen(false); // Close the timepicker after selection
        break;
      case "activity":
        setActivityType(value);
        break;
      default:
        console.warn("Unknown filter:", name);
    }
  };

  // Clear filter functions
  const clearDateFilter = (e) => {
    e.stopPropagation();
    setDate('');
  };
  
  const clearTimeFilter = (e) => {
    e.stopPropagation();
    setTime('');
  };

  // Filter the data based on search query
  const filteredActivity = inventory.filter(
    (item) =>
      (item.activity_performed && 
        item.activity_performed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.activity_type && 
        item.activity_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.encoder && 
        item.encoder.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="inventory-container">
      {/* Header Section */}
      <header className="header-1">
        <div
          className="close-btn"
          onClick={() => {
            navigate("/inventory");
            setTimeout(() => window.close());
          }}
        >
          <IoArrowBack size={20} /> Close
        </div>

        <div className="logo-container-1">
          <img src={DCHLogo} alt="DCH" className="DCH-1" />
        </div>
      </header>

      {/* Action Panel */}
      <div className="action-panel">
        <div className="warehouse-dropdown" ref={dropdownRef}>
          <select
            className="dropdown-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
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
      </div>

      {/* Activity Table */}
      <div className="inventory-table">
        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
          <div className="header-cell">
            <span>Activity</span>
          </div>
          <div className="header-cell">
            <div className="select-container">
              <select
                name="activity"
                value={activityType}
                onChange={handleFilterChange}
                className="enhanced-select"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Activity Type</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="STOCK OUT">STOCK OUT</option>
                <option value="STOCK IN">STOCK IN</option>
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          <div className="header-cell">
            <div className="select-container">
              <select
                name="users"
                value={user}
                onChange={handleFilterChange}
                className="enhanced-select"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Encoder</option>
                {userList.map((option) => (
                  <option key={option.inventory_Id || option.id} value={option.encoder}>
                    {option.encoder}
                  </option>
                ))}
              </select>
              <FaChevronDown className="select-icon" />
            </div>
          </div>
          <div className="header-cell">
            <div className="time-filter" ref={timeInputRef}>
              <input 
                type="time" 
                name="time" 
                value={time}
                onChange={handleFilterChange}
                className="time-input"
                style={{ display: timeInputOpen ? 'block' : 'none' }}
              />
              <div 
                className={`custom-time-display ${time ? 'active' : ''}`}
                onClick={handleTimeClick}
                style={{ display: timeInputOpen ? 'none' : 'flex' }}
                data-placeholder="Time Filter"
              >
                {time || ""}
                {time && (
                  <span className="clear-filter" onClick={clearTimeFilter}>
                    <FaTimes size={12} />
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="header-cell">
            <div className="date-filter" ref={dateInputRef}>
              <input 
                type="date" 
                name="date" 
                value={date}
                onChange={handleFilterChange}
                className="date-input"
                style={{ display: dateInputOpen ? 'block' : 'none' }}
              />
              <div 
                className={`custom-date-display ${date ? 'active' : ''}`}
                onClick={handleDateClick}
                style={{ display: dateInputOpen ? 'none' : 'flex' }}
                data-placeholder="Date Filter"
              >
                {date || ""}
                {date && (
                  <span className="clear-filter" onClick={clearDateFilter}>
                    <FaTimes size={12} />
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="header-cell" style={{ justifyContent: "center" }}>
            Location
          </div>
        </div>

        <div className="table-body">
          {filteredActivity.length > 0 ? (
            filteredActivity.map((item) => (
              <div className="table-row" key={item.report_id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                <div className="item-cell">
                  <div className="item-details">
                    <div className="item-category">{item.activity_performed}</div>
                  </div>
                </div>
                <div className="brand-cell">
                  <div className="item">{item.activity_type}</div>
                </div>
                <div className="brand-cell">
                  <div className="item">{item.encoder}</div>
                </div>
                <div className="brand-cell">
                  <div className="item">{item.time}</div>
                </div>
                <div className="location-cell">
                  <div className="item">
                    {new Date(item.date_performed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="actions-cell" style={{ justifyContent: "center" }}>
                  <div className="action-buttons-container">
                    <div className="location-display">
                      {item.location || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">No activity records found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityReport;