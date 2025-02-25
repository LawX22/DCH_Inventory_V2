import React, { useState, useEffect } from "react";
import axios from "axios";

const StockInModal = ({ isOpen, onClose, data }) => {
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
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-1">
      <div className="modal-container-1">
        <h2 className="modal-title-1">Stock In Item</h2>
        <form onSubmit={handleSubmit} className="modal-form-1">
          {/* Image Upload Section */}
          <div className="image-upload-container-1">
            {imagePreview ? (
              <img
                src={`/src/backend/${imagePreview}`}
                alt="Preview"
                className="image-preview-1"
              />
            ) : (
              <div className="upload-placeholder-1">
                <label htmlFor="imageUpload" className="upload-button-1">
                  Click to upload image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input-1"
                  id="imageUpload"
                />
              </div>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-container-1">
            {/* Item Details */}
            <div className="form-group-1 full-width-1">
              <label className="form-label-1">Item Description</label>
              <p className="item-desc-1">{itemDesc1 + " " + itemDesc2}</p>
            </div>

            <div className="form-group-1">
              <label className="form-label-1">Brand</label>
              <p className="item-brand-1">{itemBrand}</p>
            </div>

            {/* Units Added */}
            <div className="form-group-1">
              <label className="form-label-1">Units Added</label>
              <input
                type="number"
                name="unitsAdded"
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>

            {/* Date Input */}
            <div className="form-group-1">
              <label className="form-label-1">Date</label>
              <input
                type="date"
                name="date"
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>

            {/* Requisition Number */}
            <div className="form-group-1">
              <label className="form-label-1">Requisition #</label>
              <input
                type="number"
                name="requisitionNum"
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>

            {/* Hidden Fields */}
            <input type="hidden" name="username" value={storedValue} />
            <input type="hidden" name="itemId" value={itemId} />
          </div>

          {/* Modal Actions (Buttons) */}
          <div className="modal-actions-1">
            <button type="submit" className="save-button-1">
              SAVE
            </button>
            <button type="button" onClick={onClose} className="cancel-button-1">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockInModal;
