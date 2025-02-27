import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineDown,
} from "react-icons/ai";
import { FiDownload, FiActivity } from "react-icons/fi";
import Header from "./Header";
import axios from "axios";

import InventoryModal from "../modals/InventoryModal";
import EditModal from "../modals/edit_InventoryModal";

function Inventory() {
  const [editModalOpen, seteditModalOpen] = useState(false);

  const [category, setCategory] = useState();
  const [brand, setBrand] = useState('');
  const [area, setArea] = useState('');

  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [areaList, setAreaList] = useState([]);


  const [searchQuery, setSearchQuery] = useState("");
  const user = localStorage.getItem("username");


  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: "",
    itemBrand: "",
    itemCategory: "",
    description1: "",
    description2: "",
    units: "",
    fixedPrice: "",
    retailPrice: "",
    location: "",
    storageArea: "",
    image: null,
  });

  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "All"
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Unknown"
  );
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  // Update localStorage when the location changes
  useEffect(() => {
    localStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

  //FIX THE BUG WHERE IT DOOES NOT LOAD INITIAL

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_Inventory.php", {
        params: { location: selectedLocation, search: searchQuery , category: category, brand: brand, area: area},
      })
      .then((response) => {
        setInventory(response.data.inventory || response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));

  }, [selectedLocation, searchQuery, inventory]); // Re-run when searchQuery changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    default:
      console.warn("Unknown filter:", name);
  }
};

  

  function openEditFunc(data) {
    setSelectedData(data);
    seteditModalOpen(true);
  }

  async function deleteFunc(id, username) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!isConfirmed) return; // Stop if the user cancels

    try {
      await axios.post(
        "http://localhost/DCH_Inventory_V2/src/backend/delete_inventory.php",
        new URLSearchParams({
          id: id,
          username: username, // Add username here
        })
      );

      console.log("Deleted successfully");
  
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsModalOpen(false);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      (item.itemCode &&
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemBrand &&
        item.itemBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemDesc_1 &&
        item.itemDesc_1.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemDesc_2 &&
        item.itemDesc_2.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const handleExport = () => {
    window.open("http://localhost/DCH_Inventory_V2/src/backend/export_inventory.php", "_blank");
  };


  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_category_header.php")
      .then((response) => {
        setCategoryList(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_brands_header.php")
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

  return (
    <div className="inventory-container">
      <Header />

      <div className="action-panel">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <AiOutlinePlus size={18} />
          <span>Add New Item</span>
        </button>

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

        <button className="export-button" onClick={handleExport}>
          <FiDownload size={18} />
          <span>Export</span>
        </button>

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

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => seteditModalOpen(false)}
        data={selectedData}
      />

      <div className="inventory-table">
        <div className="table-header">
          <div className="header-cell with-arrow">
            <select name="category" onChange={handleFilterChange}> 

            <option value="">Item</option>
        {categoryList.map((option) => (
          <option key={option.inventory_Id} value={option.category}>
            {option.category}
          </option>
        ))}
            </select>

           
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
           
            <select name="brand" onChange={handleFilterChange}>  

            <option value="">Brand</option>
            {brandList.map((option) => (
            <option key={option.inventory_Id} value={option.brand}>
            {option.brand}
            </option>
            ))}
            </select>

            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <select name="area" onChange={handleFilterChange}>
            <option value="">Area</option>
            {areaList.map((option) => (
            <option key={option.inventory_Id} value={option.storage_area}>
            {option.storage_area}
            </option>
            ))}
            </select>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Price</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell with-arrow">
            <span>Inventory</span>
            <AiOutlineDown size={10} style={{ marginLeft: "10" }} />
          </div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {filteredInventory.map((item, key) => (
            <div className="table-row" key={item.inventory_id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <img
                    src={`/src/backend/${item.image}`}
                    alt={item.name}
                    className="item-image"
                  />
                </div>
                <div className="item-details">
                  <div className="item-name">
                    {item.itemDesc_1 + " " + item.itemDesc_2}
                  </div>
                  <div className="item-category">{item.category}</div>
                  <div className="item-id">{item.itemCode}</div>
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
                  <div>TSV - ₱ {item.totalstockValue}</div>
                </div>
              </div>
              <div className="actions-cell">
                <button
                  className="action-button view-button"
                  onClick={() => openEditFunc(item)}
                >
                  <AiOutlineEye size={18} />
                  <span>Edit</span>
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => deleteFunc(item.inventory_Id, user)}
                >
                  <AiOutlineDelete size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
