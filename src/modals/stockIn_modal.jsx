import React, { useState, useEffect } from "react";
import axios from "axios";

const StockInModal = ({ isOpen, onClose, data}) => {
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
    username: localStorage.getItem("username") || "", 
    image: null,
    itemId: ""
  });

  const [itemId, setItemId] = useState('');

  const [itemCode, setItemCode] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemDesc1, setItemDesc1] = useState('');
  const [itemDesc2, setItemDesc2] = useState('');
  const [units, setUnits] = useState('');
  const [fixedPrice, setFixedPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [location, setLocation] = useState('');
  const [storageArea, setStorageArea] = useState('');
  const user = localStorage.getItem("username");
  const [username, setusername] = useState(user);

  const [imagePreview, setImagePreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [requisitionNum, setrequisitionNum] = useState([]);
  const [requisitionDate, setrequisitionDate] = useState([]); 
  const [unitsAdded, setunitsAdded] = useState([]);
  const [category, setCategory] = useState([]);


  // Fetch brand data from backend when component mounts
  useEffect(() => {
    if (data) {
      setItemId(data.inventory_Id || '');
      setItemCode(data.itemCode || '');
      setItemBrand(data.brand || '');
      setItemCategory(data.category || '');
      setItemDesc1(data.itemDesc_1 || '');
      setItemDesc2(data.itemDesc_2 || '');
      setUnits(data.units || '');
      setFixedPrice(data.price || '');
      setRetailPrice(data.retail_price || '');
      setLocation(data.location || '');
      setStorageArea(data.storage_area || '');
      setImagePreview(data.image || '');
    }
  }, [data]); // Add dependency to ensure it runs when `data` changes
  


  useEffect(() => {
    axios.get("http://localhost/DCH_Inventory_V2/src/backend/list_brands.php")
      .then(response => {
        setBrands(response.data); // Store fetched brands in state
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);


  // Fetch brand data from backend when component mounts
  useEffect(() => {
    axios.get("http://localhost/DCH_Inventory_V2/src/backend/list_category.php")
      .then(response => {
        setCategory(response.data); // Store fetched brands in state
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const storedValue = localStorage.getItem("username");
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    switch (name) {
      case "itemId":
        setItemId(value);
        break;
      case "requisitionNum":
        setrequisitionNum(value);  // ✅ FIXED
        break;
      case "requisitionDate":
        setrequisitionDate(value);
        break;
      case "unitsAdded":
        setunitsAdded(value);
        break;
      default:
        break;
    }
  };
  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Date before sending:", requisitionDate); // Debugging
  
    const formDataToSend = new FormData();
    formDataToSend.append("itemId", itemId);
    formDataToSend.append("requisitionNum", requisitionNum);
    formDataToSend.append("requisitionDate", requisitionDate); // Ensure it's correctly formatted
    formDataToSend.append("unitsAdded", unitsAdded);
    formDataToSend.append("username", username);
  
    try {
      const response = await axios.post(
        "http://localhost/DCH_Inventory_V2/src/backend/stockIn_inventory.php",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      console.log("API Response:", response.data);
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Stock In Item</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="flex flex-col items-center space-y-4">
            <div className="image-upload-container">
              {imagePreview ? (
                <img src={`/src/backend/${imagePreview}`} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-text">Click to upload image</div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="file-input hidden" id="imageUpload" />
                  <label htmlFor="imageUpload" className="upload-button cursor-pointer">
                    Browse
                  </label>
                </div>
              )}
            </div>

         

                <button
        type="button"
        onClick={() => {
          setImagePreview(null);
          setFormData((prevData) => ({ ...prevData, image: null }));
        }}
        className="clear-image-button bg-red-500 text-white px-2 py-1 rounded mt-2"
      >
        Clear Image
      </button>
            <div className="modal-actions flex flex-row justify-between w-full space-x-4">
              <button type="submit" className="save-button bg-blue-500 text-white px-4 py-2 rounded">
                SAVE
              </button>
              <button type="button" onClick={onClose} className="cancel-button bg-gray-400 text-white px-4 py-2 rounded">
                CANCEL
              </button>
            </div>
          </div>
          <div className="form-fields-container">
          
        
          <div className="form-group">

        <div className="item-specs">
        {itemDesc1 + ' ' +itemDesc2} <br />
        {itemBrand} <br />

        </div>


              <label className="form-label">Units Added</label>
              <input type ="number" name="unitsAdded" onChange={handleInputChange} className="form-select"/>
            </div>
     
              <div className="form-group">
              <label className="form-label">Date</label>
              <input type ="date" name="requisitionDate" onChange={handleInputChange} className="form-select"/>
            </div>
          
            <div className="form-group">
              <label className="form-label">Requisition #</label>
              <input type="text" name="requisitionNum" onChange={handleInputChange} className="form-select"/>
            </div>

            <div className="form-group" style ={{display:'none'}}>
                <label className="form-label">USERNAME</label>
                <input type="text" name="username" value={storedValue} onChange={handleInputChange} className="form-input" />
              </div>

              <div className="form-group" style ={{display:'none'}}>
                <label className="form-label">ITEM ID</label>
                <input type="text" name="itemId" value={itemId} onChange={handleInputChange} className="form-input" />
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockInModal;
