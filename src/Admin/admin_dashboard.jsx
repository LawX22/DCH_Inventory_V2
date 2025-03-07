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
const exampleStaffData = [
  {
    "username": "Dhaniel Malinao",
    "role": "Inventory Manager"
  },
  {
    "username": "Lawrenz Carisusa",
    "role": "Warehouse Supervisor"
  }
];



function ItemDetails({ }) {
  const [itemData, setItemData] = useState({});

  useEffect(() => {
      const fetchItem = async () => {
          try {
              const response = await axios.get(`http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php`);
              setItemData(response.data);
          } catch (error) {
              console.error("Error fetching item data:", error);
          }
      };

      fetchItem();
  }, [itemId]);
}



const Dashboard = () => {
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [staffsList, setStaffsList] = useState([]);


  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Fetch staffs list (simulated with example data)
  useEffect(() => {
    // In a real application, this would be an actual API call
    try {
      // Simulating API response with example data
      setStaffsList(exampleStaffData);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  }, []);



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
}, []);

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
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php") // Adjust the URL to your actual PHP file location
      .then((response) => {
        setActivityData(response.data);

        const perDayRow = data.find(row => row.action === "Per day");

      if (perDayRow) {
        setActivityTotal(perDayRow.total); // Set total into state
      } else {
        setActivityTotal(0); // Fallback if "Per day" row is missing
      }
      })
      .catch((error) => {
        console.error("There was an error fetching the activity data!", error);
      });
  }, []);

  const average = 0.29;







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
              <select
                className="dropdown-select-1"
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">Select Staff</option>
                {staffsList.map((staff) => (
                  <option key={staff.username} value={staff.username}>
                    {staff.username}
                  </option>
                ))}
              </select>
              <FaChevronDown className="select-icon-1" />
            </div>
          </div>

          <div className="select-date-container-1">
            <input type="date" className="date-input-1" />
          </div>

          <button className="export-button-1">
            <FiDownload size={18} />
            <span>Export</span>
          </button>

          <button className="activity-button-1">
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