import React, { useState, useEffect } from "react";
import Header from "./admin_Header";
import axios from "axios";

// Icon imports
import { FiDownload, FiActivity } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import {
  Package2Icon,
  ShoppingCartIcon,
  FileTextIcon,
  TruckIcon,
} from "lucide-react";

// Example staff data (typically would come from backend)


const Dashboard = () => {
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [staffsList, setStaffsList] = useState([]);


  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  const [itemData, setItemData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(getCurrentDate()); 

    const [selectedEncoder, setSelectedEncoder] = useState(
      localStorage.getItem("selectedEncoder") || "All"
    );

      useEffect(() => {
        localStorage.setItem("selectedEncoder", selectedEncoder);
      }, [selectedEncoder]);

  const [userList, setUserList] = useState([]);
 useEffect(() => {
      axios
        .get("http://localhost/DCH_Inventory_V2/src/backend/list_encoders_header.php")
        .then((response) => {
          setUserList(response.data); // Store fetched brands in state
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    }, []);

    useEffect(() => {
      console.log("Selected Encoder:",selectedEncoder); // Debugging
  
      const fetchItem = async () => {
          if (!selectedEncoder) {
              console.warn("No encoder selected, skipping API call.");
              return;
          }
  
          try {
              const response = await axios.get(
                  "http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php",{
                      params: { encoder: selectedEncoder },
                  }
              )
              console.log("API Response:", response.data);
              setItemData(response.data);
          } catch (error) {
              console.error("Error fetching item data:", error);
          }
      };
  
      fetchItem();
  }, [selectedEncoder]); // Remove `itemData` from dependencies to prevent infinite re-renders
  
  


  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Fetch staffs list (simulated with example data)




  // Format options for date
  const dateFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format options for time
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Dashboard metrics

  const [inventoryCount, setInventoryCount] = useState(0);
  const [requisitionsCount, setRequisitionsCount] = useState(342);
  const [ordersCount, setOrdersCount] = useState(128);

  useEffect(() => {
    axios.get('http://localhost/DCH_Inventory_V2/src/backend/dashboard_data.php')
        .then(response => {
            console.log('Dashboard Stats:', response.data);
            // Example usage:
            console.log('Weekly Average Activity:', response.data.weekly_average_activity);
            setInventoryCount(response.data.inventory_merge_total);
            console.log('Total Inventory:', response.data.inventory_merge_total);
        })
        .catch(error => {
            console.error('Failed to fetch dashboard stats:', error);
        });
}, [inventoryCount]);

  // Dashboard card data
  const dashboardCards = [
    {
      icon: <Package2Icon size={24} className="text-blue-600" />,
      title: "Total Inventory",
      value: inventoryCount,
      change: "+2.5%",
      color: "blue",
    },
    {
      icon: <ShoppingCartIcon size={24} className="text-green-600" />,
      title: "Total Orders",
      value: ordersCount,
      change: "+1.2%",
      color: "green",
    },
    {
      icon: <FileTextIcon size={24} className="text-purple-600" />,
      title: "Requisitions",
      value: requisitionsCount,
      change: "-0.5%",
      color: "purple",
    },
    {
      icon: <TruckIcon size={24} className="text-orange-600" />,
      title: "Shipments",
      value: "128",
      change: "+3.1%",
      color: "orange",
    },
  ];
  // Activity data
 const [activityData, setActivityData] = useState([]);


 useEffect(() => {
  console.log("Selected Encoder:", selectedEncoder);
  const { start, end } = getWeekRange(selectedWeek);

  const fetchItem = async () => {
    try {
      const response = await axios.get(
        "http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php",
        { params: { encoder: selectedEncoder, startOfWeek: start, endOfWeek: end } }
      );
      console.log("API Response:", response.data);
      // Ensure response is an array before setting state
      if (Array.isArray(response.data)) {
        setActivityData(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setActivityData([]); // Reset state to empty array
      }
    } catch (error) {
      console.error("Error fetching item data:", error);
      setActivityData([]); // Reset state to prevent errors in .map()
    }
  };
  if (selectedEncoder) { 
    fetchItem();
  }
}, [selectedEncoder, selectedWeek]);
 // Don't include itemData, prevents infinite requests


  const average = 0.29;

  function getWeekRange(selectedWeek) {
    try {
        if (!selectedWeek) {
            throw new Error("No week selected");
        }

        // Extract year and week number from "YYYY-Wxx"
        let year = parseInt(selectedWeek.substring(0, 4));   // Extract "2024"
        let week = parseInt(selectedWeek.substring(6));      // Extract "15"

        if (isNaN(year) || isNaN(week)) {
            throw new Error("Invalid week format");
        }

        // Get January 1st of the given year
        let firstDayOfYear = new Date(year, 0, 1);
        let daysOffset = (week - 1) * 7;

        // Find Monday of the selected week
        let firstMonday = new Date(firstDayOfYear);
        firstMonday.setDate(firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay() + 1);

        // Set Monday as start, and Saturday as end
        let start = new Date(firstMonday);
        let end = new Date(start);
        end.setDate(start.getDate() + 5); // Saturday (5 days after Monday)

        // Convert to YYYY-MM-DD format
        let startFormatted = start.toISOString().split("T")[0];
        let endFormatted = end.toISOString().split("T")[0];

        return { start: startFormatted, end: endFormatted };
    } catch (error) {
        console.error("Error in getWeekRange:", error.message);
        return { start: null, end: null };
    }
}



  function getCurrentWeek() {
    const today = new Date();
    const year = today.getFullYear();
    const weekNumber = getWeekNumber(today);
    return `${year}-W${weekNumber}`;
  }

  // Function to get the week number (ISO standard)
  function getWeekNumber(date) {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const firstJan = new Date(tempDate.getFullYear(), 0, 4);
    return Math.ceil(((tempDate - firstJan) / 86400000 + 1) / 7);
  }

  return (
    <div className="dashboard-container">
      <Header />

      <div className="action-panel-1">
        <div className="left-panel">
          <div className="date-time-display">
            <p className="date">
              {currentDateTime.toLocaleDateString("en-US", dateFormatOptions)}
            </p>
            <p className="time">
              {currentDateTime.toLocaleTimeString("en-US", timeFormatOptions)}
            </p>
          </div>
        </div>

        <div className="right-panel">
          <div className="staffs-dropdown">
            <div className="select-container">
             <div className="warehouse-dropdown">
             <select
          
            value={selectedEncoder}
            onChange={(e) => setSelectedEncoder(e.target.value)}
          >
            <option value="All">All</option>  
            <option value="dhaniel">dhaniel</option>
            <option value="jeff">jeff</option>
          </select>
        </div>
              <FaChevronDown className="select-icon-1" />
            </div>
          </div>

          <div className="select-date-container-1">
          <label>Select Week:</label>
      <input
        type="week" 
        value={selectedWeek}
        onChange={(e) => setSelectedWeek(e.target.value)}
      />
          </div>

          <button className="export-button-1">
            <FiDownload size={18} />
            <span>Export</span>
          </button>

          <button className="activity-button-1"
           onClick={() =>
            window.open("/activity", "_blank", "noopener,noreferrer")
          }>
            <FiActivity size={18} />
            <span>Activity</span>
          </button>
        </div>
      </div>

      {/* Dashboard Cards Section */}
      <div className="dashboard-cards-container">
        {dashboardCards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-icon">{card.icon}</div>
              <div className="dashboard-card-details">
                <p className="dashboard-card-title">{card.title}</p>
                <div className="dashboard-card-value-container">
                  <span className="dashboard-card-value">{card.value}</span>
                  <span
                    className={`dashboard-card-change ${
                      card.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity table */}
      <div className="table-card-1">
        <div className="table-header-1">
          <h2>Weekly Activity</h2>
        </div>
        <div className="table-container-1">
          <table>
            <thead>
              <tr>
                <th>Store PC</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th className="highlight">Total</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : ""}>
                  <td className="cell-header">{row.action}</td>
                  <td>
                    {row.monday > 0 ? (
                      <span className="value-highlight">{row.monday}</span>
                    ) : (
                      row.monday
                    )}
                  </td>
                  <td>
                    {row.tuesday > 0 ? (
                      <span className="value-highlight">{row.tuesday}</span>
                    ) : (
                      row.tuesday
                    )}
                  </td>
                  <td>
                    {row.wednesday > 0 ? (
                      <span className="value-highlight">{row.wednesday}</span>
                    ) : (
                      row.wednesday
                    )}
                  </td>
                  <td>
                    {row.thursday > 0 ? (
                      <span className="value-highlight">{row.thursday}</span>
                    ) : (
                      row.thursday
                    )}
                  </td>
                  <td>
                    {row.friday > 0 ? (
                      <span className="value-highlight">{row.friday}</span>
                    ) : (
                      row.friday
                    )}
                  </td>
                  <td>
                    {row.saturday > 0 ? (
                      <span className="value-highlight">{row.saturday}</span>
                    ) : (
                      row.saturday
                    )}
                  </td>
                  <td className="highlight">
                    {row.total > 0 ? (
                      <span className="value-highlight">{row.total}</span>
                    ) : (
                      row.total
                    )}
                  </td>
                </tr>
              ))}
              <tr className="footer-row">
                <td className="cell-header">Average</td>
                <td colSpan="7">{average}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;