import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaBoxes,
  FaClipboardList,
  FaSignOutAlt,
  FaUser,
  FaBell,
  FaCog,
  FaUserCircle
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function SalesmanHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showNotifications || showUserMenu) {
        // Check if click is outside dropdown areas
        const isOutsideClick = 
          !event.target.closest('.notifications-dropdown') && 
          !event.target.closest('.notification-icon-container') &&
          !event.target.closest('.user-dropdown') && 
          !event.target.closest('.user-info');
        
        if (isOutsideClick) {
          setShowNotifications(false);
          setShowUserMenu(false);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  // Load user data on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserType = localStorage.getItem("userType");

    if (storedUsername) setUsername(storedUsername);
    if (storedUserType) setUserType(storedUserType);

    // Placeholder for salesman notification loading
    setNotifications([
      { id: 1, message: "New order approved", isRead: false },
      { id: 2, message: "Price update for 3 products", isRead: false },
      { id: 3, message: "Monthly sales target achieved", isRead: true },
    ]);

    // Close mobile menu when changing routes
    return () => {
      setMenuOpen(false);
      setShowUserMenu(false);
    };
  }, [location.pathname]);

  // Logout Function with Confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("username");
      localStorage.removeItem("userType");

      // Clear all filters
      clearHeaderFilter();

      navigate("/");
    }
  };

  // Function to check if a nav item is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // Function to clear all filters
  function clearHeaderFilter() {
    const filtersToReset = [
      "activityTypeAH",
      "dateAH",
      "userAH",
      "brand",
      "area",
      "category",
      "brandSH",
      "areaSH",
      "dateSH",
      "categorySH"
    ];

    filtersToReset.forEach((filter) => localStorage.removeItem(filter));
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <header className="header">
      <div className="header-overlay"></div>

      <div className="logo-container">
        <img src="/src/assets/DCH.png" alt="DCH" className="DCH" />
        {userType && (
          <div className="user-role-badge">{userType.toUpperCase()}</div>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
        <div
          className={`nav-item ${isActive("/Salesman_PriceList")}`}
          onClick={() => {
            clearHeaderFilter();
            navigate("/Salesman_PriceList");
          }}
        >
          <FaBoxes className="nav-icon" />
          <span>Price List</span>
        </div>
        <div
          className={`nav-item ${isActive("/Orders")}`}
          onClick={() => navigate("/Orders")}
        >
          <FaClipboardList className="nav-icon" />
          <span>Requisitions</span>
        </div>
      </nav>

      {/* Right-side Utilities */}
      <div className="header-utilities">
        {/* Notifications */}
        <div className="utility-item">
          <div className="notification-icon-container">
            <FaBell
              className="utility-icon"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
            />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                    >
                      {notification.message}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="utility-item user-profile">
          <div
            className="user-info"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <span className="username">{username || "Salesman"}</span>
            <FaUser className="utility-icon" />
          </div>

          {/* User dropdown menu with improved design */}
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar">
                  <FaUserCircle />
                </div>
                <div className="user-details">
                  <div className="user-name">{username || "Salesman"}</div>
                  <div className="user-type">{userType || "Sales"}</div>
                </div>
              </div>

              <div className="user-dropdown-items">
                <div
                  className="user-dropdown-item"
                  onClick={() => navigate("/salesman-profile")}
                >
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </div>
                <div
                  className="user-dropdown-item"
                  onClick={() => navigate("/salesman-settings")}
                >
                  <FaCog className="dropdown-icon" />
                  <span>Settings</span>
                </div>
                <div className="user-dropdown-divider"></div>
                <div
                  className="user-dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SalesmanHeader;