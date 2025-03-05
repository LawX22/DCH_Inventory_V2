import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineEye, AiOutlineDown } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function ActivityReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);

   

       const [activityType, setActivityType] = useState(
         localStorage.getItem("activityTypeAH") || ''
       );
     
       const [date, setDate] = useState(
         localStorage.getItem("dateAH") || ''
       );
     
       const [user, setUser] = useState(
         localStorage.getItem("userAH") || ''
       );

          useEffect(() => {
             localStorage.setItem("activityTypeAH", ""); // Set brand to empty string (or any value you want)
             localStorage.setItem("dateAH", ""); // Set area to empty string
             localStorage.setItem("userAH", ""); // Set category to empty string
         
             setActivityType('');
             setDate('');
             setUser('');
         
           
           }, []);

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


    const handleFilterChange = (e) => {
      const { name, value } = e.target;
    
      switch (name) {
        case "users":
          setUser(value);
    
          break;
  
          case "date":
            setDate(value);
      
            break;
            
            case "activity":
            setActivityType(value);
    
          break;
        default:
          console.warn("Unknown filter:", name);
      }
    };


     const [selectedLocation, setSelectedLocation] = useState(
       localStorage.getItem("selectedLocation") || "All"
     );
   
     useEffect(() => {
       localStorage.setItem("selectedLocation", selectedLocation);
       localStorage.setItem("activityTypeAH", activityType);
       localStorage.setItem("dateAH", date);
       localStorage.setItem("userAH", user);
     }, [selectedLocation,date,user,activityType]);
  
  const navigate = useNavigate();

   useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_activityReport.php", {
        params: { location: selectedLocation, search: searchQuery, user:user, date:date, activityType:activityType },
      })
      .then((response) => {
        console.log(response.data); // Inspect what the API returns
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedLocation, searchQuery, inventory, date, activityType, user]); // Re-run when searchQuery changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="activity-container">
      {/* Header Section - Matches Inventory */}
      <header className="header-1">
        {/* Back Button on the Left */}
        <div
          className="close-btn"
          onClick={() => {
            navigate("/inventory"); // Navigate to Inventory
            setTimeout(() => window.close());
          }}
        >
          <IoArrowBack size={20} /> Close
        </div>

        {/* Logo in the Center */}
        <div className="logo-container-1">
          <img src="/src/assets/DCH.png" alt="DCH" className="DCH-1" />
        </div>
      </header>

      {/* Action Panel */}
      <div className="action-panel">

        <div className="warehouse-dropdown-1">
          <select className="dropdown-select-1" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
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

      {/* Inventory Table */}
      <div className="inventory-table-1">
        <div className="table-header-1">
          <div className="header-cell-1 with-arrow">
            <span>Activity</span>
            <AiOutlineDown size={10} style={{ marginLeft: "15" , marginTop: "2" }} />
          </div>
          <div className="header-cell-1 with-arrow">
          <select name="activity" onChange={(e) =>setActivityType(e.target.value)}>    
            <option value="">Activity</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="STOCK OUT">STOCK OUT</option>
            <option value="STOCK IN">STOCK IN</option>

         
            </select>
            <AiOutlineDown size={10} style={{ marginLeft: "15" , marginTop: "2" }}  />
          </div>
          <div className="header-cell-1 with-arrow">
          <select name="user" onChange={(e) =>setUser(e.target.value)}>    

            <option value="">Encoder</option>
            {userList.map((option) => (
            <option key={option.inventory_Id} value={option.encoder}>
            {option.encoder}
            </option>
            ))}
            </select>
            <AiOutlineDown size={10} style={{ marginLeft: "15" , marginTop: "2" }}  />
          </div>


          
          <div className="header-cell-1 with-arrow">
          <span>Date <input type="date" name="date"  onChange={(e) =>setDate(e.target.value)}/></span>
            <AiOutlineDown size={10} style={{ marginLeft: "15" , marginTop: "2" }}  />
          </div>
          <div className="header-cell-1">Location</div>
        </div>

        <div className="table-body-1">
          {inventory.map((item) => (
            <div className="table-row-1" key={item.report_id}>
              <div className="activity-cell-1">{item.activity_performed}</div>
              <div className="type-cell-1">{item.activity_type}</div>
              <div className="user-cell-1">{item.encoder}</div>
              <div className="date-cell-1">
                {new Date(item.date_performed).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="actions-cell-1">
                <button className="action-button-1 view-button-1">
                 {item.location}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityReport;