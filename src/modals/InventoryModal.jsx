import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemBrand: "",
    itemCategory: "",
    description1: "",
    description2: "",
    description3: "", // Added description3
    description4: "", // Added description4
    units: "",
    fixedPrice: "",
    retailPrice: "",
    location: "",
    storageArea: "",
    username: localStorage.getItem("username") || "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);

  // Fetch brand data from backend when component mounts
  useEffect(() => {
    axios
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_brands.php"
      )
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
      .get(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/list_category.php"
      )
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post(
        "https://slategrey-stingray-471759.hostingersite.com/api/backend/add_inventory.php",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="imd-modal-overlay">
      <div className="imd-modal-container">
        <h2 className="imd-modal-title">ADD NEW ITEM</h2>
        <form onSubmit={handleSubmit} className="imd-modal-form">
          <div className="imd-flex imd-flex-col imd-items-center imd-space-y-4">
            <div className="imd-image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="imd-file-input imd-hidden"
                id="imageUpload"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="imd-image-preview imd-cursor-pointer"
                  onClick={() => document.getElementById("imageUpload").click()}
                />
              ) : (
                <div className="imd-upload-placeholder">
                  <div className="imd-upload-text">Click to upload image</div>
                  <label
                    htmlFor="imageUpload"
                    className="imd-upload-button imd-cursor-pointer"
                  >
                    Browse
                  </label>
                </div>
              )}
            </div>

            <div className="imd-modal-actions imd-flex imd-flex-row imd-justify-between imd-w-full imd-space-x-4">
              <button
                type="submit"
                className="imd-save-button imd-bg-blue-500 imd-text-white imd-px-4 imd-py-2 imd-rounded"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="imd-cancel-button imd-bg-gray-400 imd-text-white imd-px-4 imd-py-2 imd-rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
          <div className="imd-form-fields-container">
            <div className="imd-form-group imd-full-width">
              <label className="imd-form-label">ITEM ID *( FLP113000 )</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                className="imd-form-input"
              />
            </div>
            <div className="imd-form-group">
              <label className="imd-form-label">ITEM BRAND</label>
              <input
                list="brands"
                name="itemBrand"
                value={formData.itemBrand}
                onChange={handleInputChange}
                className="imd-form-select"
              />
              <datalist id="brands">
                {brands.map((brand, index) => (
                  <option key={index} value={brand} />
                ))}
              </datalist>
            </div>
            <div className="imd-form-group">
              <label className="imd-form-label">ITEM CATEGORY</label>
              <input
                list="categories"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleInputChange}
                className="imd-form-select"
              />
              <datalist id="categories">
                {category.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            <div className="imd-descriptions-container imd-flex imd-flex-row imd-w-full imd-space-x-4">
              <div className="imd-form-group imd-w-1/2">
                <label className="imd-form-label">
                  DESCRIPTION 1 *( Category )
                </label>
                <input
                  type="text"
                  name="description1"
                  value={formData.description1}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
              <div className="imd-form-group imd-w-1/2">
                <label className="imd-form-label">
                  DESCRIPTION 3 *( Item Codes )
                </label>
                <input
                  type="text"
                  name="description3"
                  value={formData.description3}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
            </div>

            <div className="imd-descriptions-container imd-flex imd-flex-row imd-w-full imd-space-x-4 mt-4">
              <div className="imd-form-group imd-w-1/2">
                <label className="imd-form-label">
                  DESCRIPTION 2 *( Measurements )
                </label>
                <input
                  type="text"
                  name="description2"
                  value={formData.description2}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
              <div className="imd-form-group imd-w-1/2">
                <label className="imd-form-label">
                  DESCRIPTION 4 *( Type of Car )
                </label>
                <input
                  type="text"
                  name="description4"
                  value={formData.description4}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
            </div>
            <div className="imd-price-units-container">
              <div className="imd-form-group">
                <label className="imd-form-label">ITEM UNITS</label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
              <div className="imd-form-group">
                <label className="imd-form-label">FIXED PRICE</label>
                <input
                  type="number"
                  name="fixedPrice"
                  value={formData.fixedPrice}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
              <div className="imd-form-group">
                <label className="imd-form-label">RETAIL PRICE</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice}
                  onChange={handleInputChange}
                  className="imd-form-input"
                />
              </div>
            </div>
            <div className="imd-form-group">
              <label className="imd-form-label">LOCATION</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="imd-form-select-2"
              >
                <option value="">Select Location</option>
                <option value="STORE">STORE</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
              </select>
            </div>
            <div className="imd-form-group">
              <label className="imd-form-label">STORAGE AREA</label>
              <select
                name="storageArea"
                value={formData.storageArea}
                onChange={handleInputChange}
                className="imd-form-select-2"
              >
                <option value="">Select Storage Area</option>
                <option value="Store 1st Floor">Store 1st Floor</option>
                <option value="Store 2nd Floor">Store 2nd Floor</option>
                <option value="AREA A">AREA A</option>
              </select>
            </div>

            <div className="imd-form-group" style={{ display: "none" }}>
              <label className="imd-form-label">USERNAME</label>
              <input
                type="text"
                name="username"
                value={storedValue}
                onChange={handleInputChange}
                className="imd-form-input"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
