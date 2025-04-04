import React, { useState, useEffect } from "react";
import Header from "./admin_Header";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// Icon imports
import { FiDownload, FiActivity } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import {
  Package2Icon,
  ShoppingCartIcon,
  FileTextIcon,
  TruckIcon,
} from "lucide-react";

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [staffsList, setStaffsList] = useState([]);
  const [average, setAverage] = useState("");

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  const [itemData, setItemData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  const [selectedEncoder, setSelectedEncoder] = useState(
    localStorage.getItem("selectedEncoder") || "All"
  );

  useEffect(() => {
    localStorage.setItem("selectedEncoder", selectedEncoder);
  }, [selectedEncoder]);

  const [userList, setUserList] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost/DCH_Inventory_V2/src/backend/list_encoders_header.php"
      )
      .then((response) => {
        setUserList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Selected Encoder:", selectedEncoder); // Debugging

    const fetchItem = async () => {
      if (!selectedEncoder) {
        console.warn("No encoder selected, skipping API call.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php",
          {
            params: { encoder: selectedEncoder },
          }
        );
        console.log("API Response:", response.data);
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItem();
  }, [selectedEncoder]);

  const formatDateToWords = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const exportToExcel = async (fileName = "ExportedData.xlsx") => {
    try {
      console.log("Selected Encoder:", selectedEncoder);
      const { start, end } = getWeekRange(selectedWeek);

      const response = await axios.get(
        "http://localhost/DCH_Inventory_V2/src/backend/load_activity_table.php",
        {
          params: {
            encoder: selectedEncoder,
            startOfWeek: start,
            endOfWeek: end,
          },
        }
      );

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        console.error("No data available to export.");
        return;
      }

      const startFormatted = formatDateToWords(start); // e.g., "April 1, 2024"
      const endFormatted = formatDateToWords(end);

      const fileName = `Weekly_Report_${selectedEncoder}_${startFormatted} to ${endFormatted}.xlsx`;

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet([]);

      // Add Encoder & Date Info as Header
      const headerData = [
        [`Encoder: ${selectedEncoder || "N/A"}`], // Row 1
        [`Week Range: ${startFormatted} to ${endFormatted}`], // Row 2
        [], // Empty row before table
      ];

      XLSX.utils.sheet_add_aoa(worksheet, headerData, { origin: "A1" });

      // Add actual table data below the headers
      XLSX.utils.sheet_add_json(worksheet, data, {
        origin: "A4",
        skipHeader: false,
      });

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Convert to Excel format and trigger download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(fileData, fileName);
      console.log("Excel file successfully generated!");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleExport = () => {
    exportToExcel("MyFilteredData.xlsx");
  };

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
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
          {
            params: {
              encoder: selectedEncoder,
              startOfWeek: start,
              endOfWeek: end,
            },
          }
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

  useEffect(() => {
    const { start, end } = getWeekRange(selectedWeek);
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/dashboard_data.php", {
        params: {
          encoder: selectedEncoder,
          startOfWeek: start,
          endOfWeek: end,
        },
      })
      .then((response) => {
        console.log("Dashboard Stats:", response.data);
        // Example usage:
        console.log(
          "Weekly Average Activity:",
          response.data.weekly_average_activity
        );
        setAverage(String(response.data.weekly_average_activity));

        setInventoryCount(response.data.inventory_merge_total);
        console.log("Total Inventory:", response.data.inventory_merge_total);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboard stats:", error);
      });
  }, [inventoryCount, selectedWeek]);

  function getWeekRange(selectedWeek) {
    try {
      if (!selectedWeek) {
        throw new Error("No week selected");
      }

      // Extract year and week number from "YYYY-Wxx"
      let year = parseInt(selectedWeek.substring(0, 4)); // Extract "2024"
      let week = parseInt(selectedWeek.substring(6)); // Extract "15"

      if (isNaN(year) || isNaN(week)) {
        throw new Error("Invalid week format");
      }

      // Get January 1st of the given year
      let firstDayOfYear = new Date(year, 0, 1);
      let daysOffset = (week - 1) * 7;

      // Find Monday of the selected week
      let firstMonday = new Date(firstDayOfYear);
      firstMonday.setDate(
        firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay() + 1
      );

      // Set Monday as start, and Saturday as end
      let start = new Date(firstMonday);
      start.setDate(start.getDate() + 1);
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
    let year = today.getFullYear();
    let weekNumber = getWeekNumber(today) + 1;

    // If week number is 0 (means we're in the last week of the previous year)
    if (weekNumber === 0) {
      year -= 1;
      weekNumber = getWeekNumber(new Date(year, 11, 31)); // Get last week's number of last year
    }

    // Ensure format YYYY-WXX (e.g., 2024-W01 instead of 2024-W1)
    return `${year}-W${String(weekNumber).padStart(2, "0")}`;
  }
  // Function to get the week number (ISO standard)
  function getWeekNumber(date) {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);

    // Set to Thursday of the current week (ensures correct ISO week number)
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() || 7));

    // Get January 4th of the year (guaranteed to be in week 1)
    const firstThursday = new Date(tempDate.getFullYear(), 0, 4);

    // Calculate the week number
    const weekNumber = Math.round(
      ((tempDate - firstThursday) / 86400000 + 1) / 7
    );

    return weekNumber;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="header-container">
        <Header />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-cards-grid">
          {dashboardCards.map((card, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-icon">{card.icon}</div>
              <div className="card-details">
                <h3 className="card-title">{card.title}</h3>
                <div className="card-value-container">
                  <span className="card-value">{card.value}</span>
                  <span
                    className={`card-change ${
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
          ))}
        </div>

        <div className="action-panel-1">
          <div className="left-panel">
            <div className="date-time-display">
              <p className="date">Encoder: {selectedEncoder}</p>
              <p className="time">
                {selectedWeek &&
                  `${new Date(getWeekRange(selectedWeek).start).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} to 
            ${new Date(getWeekRange(selectedWeek).end).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}, 
            ${new Date(getWeekRange(selectedWeek).end).getFullYear()}`}
              </p>
            </div>
          </div>

          <div className="right-panel">
            <div className="staffs-dropdown-2">
              <div className="select-container">
                <div className="warehouse-dropdown-2">
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

            <button onClick={handleExport} className="export-button-1">
              <FiDownload size={18} />
              <span>Export</span>
            </button>

            <button
              className="activity-button-1"
              onClick={() =>
                window.open("/activity", "_blank", "noopener,noreferrer")
              }
            >
              <FiActivity size={18} />
              <span>Activity</span>
            </button>
          </div>
        </div>

        <div className="activity-table-card">
          <div className="table-header-1">
            <h2>Weekly Activity</h2>
          </div>
          <div className="activity-table-container">
            <table className="activity-table">
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
                  <td colSpan="7">{average} per day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
