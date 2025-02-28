import React, { useState, useEffect } from "react";
import axios from "axios";

const EditModal = ({ isOpen, onClose, data }) => {
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
    itemId: "",
  });

  const [itemId, setItemId] = useState("");

  const [itemCode, setItemCode] = useState("");
  const [itemBrand, setItemBrand] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDesc1, setItemDesc1] = useState("");
  const [itemDesc2, setItemDesc2] = useState("");
  const [units, setUnits] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [location, setLocation] = useState("");
  const [storageArea, setStorageArea] = useState("");
  const user = localStorage.getItem("username");
  const [username, setusername] = useState(user);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageChange, setImageChange] = useState(false);


  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);

  // Fetch brand data from backend when component mounts
  useEffect(() => {
    if (data) {
      setItemId(data.inventory_Id || "");
      setItemCode(data.itemCode || "");
      setItemBrand(data.brand || "");
      setItemCategory(data.category || "");
      setItemDesc1(data.itemDesc_1 || "");
      setItemDesc2(data.itemDesc_2 || "");
      setUnits(data.units || "");
      setFixedPrice(data.price || "");
      setRetailPrice(data.retail_price || "");
      setLocation(data.location || "");
      setStorageArea(data.storage_area || "");
      setImagePreview(data.image || "");
      setImageChange(false);
    }
  }, [data]); // Add dependency to ensure it runs when `data` changes

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_brands.php")
      .then((response) => {
        setBrands(response.data); // Store fetched brands in state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // Fetch brand data from backend when component mounts
  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_category.php")
      .then((response) => {
        setCategory(response.data); // Store fetched brands in state
      })
      .catch((error) => {
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
      case "itemCode":
        setItemCode(value);
        break;
      case "itemBrand":
        setItemBrand(value);
        break;
      case "itemCategory":
        setItemCategory(value);
        break;
      case "description1":
        setItemDesc1(value);
        break;
      case "description2":
        setItemDesc2(value);
        break;
      case "units":
        setUnits(value);
        break;
      case "fixedPrice":
        setFixedPrice(value);
        break;
      case "retailPrice":
        setRetailPrice(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "storageArea":
        setStorageArea(value);
        break;
      case "username":
        setusername(value);
        break;
      case "itemId":
        setItemId(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageChange(true);
      setImagePreview(objectUrl);
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("itemId", itemId); // Ensure itemId is explicitly added
    formDataToSend.append("itemCode", itemCode);
    formDataToSend.append("itemBrand", itemBrand);
    formDataToSend.append("itemCategory", itemCategory);
    formDataToSend.append("description1", itemDesc1);
    formDataToSend.append("description2", itemDesc2);
    formDataToSend.append("units", units);
    formDataToSend.append("fixedPrice", fixedPrice);
    formDataToSend.append("retailPrice", retailPrice);
    formDataToSend.append("location", location);
    formDataToSend.append("storageArea", storageArea);
    formDataToSend.append("username", username);
    formDataToSend.append("imageChange", imageChange);
    console.log(imageChange);


 

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost/DCH_Inventory_V2/src/backend/edit_inventory.php",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
    }
      alert(response.data.message);
      console.log(response.data)
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title-1">EDIT NEW ITEM</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="flex flex-col items-center space-y-4">
            <div className="image-upload-container-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input hidden"
                id="imageUpload"
              />
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <label htmlFor="imageUpload">
                  <img 
    src={imagePreview.startsWith("blob:") 
        ? imagePreview 
        : `/src/backend/${imagePreview}`
    } 
    alt="Preview" 
    className="image-preview-1" 
/>
                  </label>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-text">Click to upload image</div>
                  <label
                    htmlFor="imageUpload"
                    className="upload-button cursor-pointer"
                  >
                    Browse
                  </label>
                </div>
              )}
            </div>
            <div className="modal-actions flex flex-row justify-between w-full space-x-4">
              <button
                type="submit"
                className="save-button bg-blue-500 text-white px-4 py-2 rounded"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cancel-button bg-gray-400 text-white px-4 py-2 rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
          <div className="form-fields-container">
            <div className="form-group full-width">
              <label className="form-label">ITEM CODE</label>
              <input
                type="text"
                name="itemCode"
                value={itemCode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">ITEM BRAND</label>
              <input
                list="brands"
                name="itemBrand"
                value={itemBrand}
                onChange={handleInputChange}
                className="form-select"
              />
              <datalist id="brands">
                {brands.map((brand, index) => (
                  <option key={index} value={brand} />
                ))}
              </datalist>
            </div>
            <div className="form-group">
              <label className="form-label">ITEM CATEGORY</label>
              <input
                list="categories"
                name="itemCategory"
                value={itemCategory}
                onChange={handleInputChange}
                className="form-select"
              />
              <datalist id="categories">
                {category.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            <div className="form-group full-width">
              <label className="form-label">DESCRIPTION 1</label>
              <input
                type="text"
                name="description1"
                value={itemDesc1}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">DESCRIPTION 2</label>
              <input
                type="text"
                name="description2"
                value={itemDesc2}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="price-units-container">
              <div className="form-group">
                <label className="form-label">ITEM UNITS</label>
                <input
                  type="number"
                  name="units"
                  value={units}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">FIXED PRICE</label>
                <input
                  type="number"
                  name="fixedPrice"
                  value={fixedPrice}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">RETAIL PRICE</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={retailPrice}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">LOCATION</label>
              <select
                name="location"
                value={location}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Location</option>
                <option value="Store">Store</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">STORAGE AREA</label>
              <select
                name="storageArea"
                value={storageArea}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Storage Area</option>
                <option value="Store 1st Floor">Store 1st Floor</option>
                <option value="Store 2nd Floor">Store 2nd Floor</option>
                <option value="AREA A">AREA A</option>
              </select>
            </div>

            <div className="form-group" style={{ display: "none" }}>
              <label className="form-label">USERNAME</label>
              <input
                type="text"
                name="username"
                value={storedValue}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ display: "none" }}>
              <label className="form-label">ITEM ID</label>
              <input
                type="text"
                name="itemId"
                value={itemId}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
