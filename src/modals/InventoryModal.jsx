import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryModal = ({ isOpen, onClose }) => {
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
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);

  // Fetch brand data from backend when component mounts
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
        "http://localhost/DCH_Inventory_V2/src/backend/add_inventory.php",
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
    <div className="modal-overlay-1">
      <div className="modal-container-1">
        <h2 className="modal-title-1">ADD NEW ITEM</h2>
        <form onSubmit={handleSubmit} className="modal-form-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="image-upload-container-1">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview-1"
                />
              ) : (
                <div className="upload-placeholder-1">
                  <div className="upload-text-1">Click to upload image</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="upload-button-1 cursor-pointer"
                  >
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
              className="clear-image-button-1 bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Clear Image
            </button>

            <div className="modal-actions-1 flex flex-row justify-between w-full space-x-4">
              <button
                type="submit"
                className="save-button-1 bg-blue-500 text-white px-4 py-2 rounded"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cancel-button-1 bg-gray-400 text-white px-4 py-2 rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
          <div className="form-fields-container-1">
            <div className="form-group-1 full-width-1">
              <label className="form-label-1">ITEM CODE</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
            <div className="form-group-1">
              <label className="form-label-1">ITEM BRAND</label>
              <input
                list="brands"
                name="itemBrand"
                value={formData.itemBrand}
                onChange={handleInputChange}
                className="form-select-1"
              />
              <datalist id="brands">
                {brands.map((brand, index) => (
                  <option key={index} value={brand} />
                ))}
              </datalist>
            </div>
            <div className="form-group-1">
              <label className="form-label-1">ITEM CATEGORY</label>
              <input
                list="categories"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleInputChange}
                className="form-select-1"
              />
              <datalist id="categories">
                {category.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            <div className="form-group-1 full-width-1">
              <label className="form-label-1">DESCRIPTION 1</label>
              <input
                type="text"
                name="description1"
                value={formData.description1}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
            <div className="form-group-1 full-width-1">
              <label className="form-label-1">DESCRIPTION 2</label>
              <input
                type="text"
                name="description2"
                value={formData.description2}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
            <div className="price-units-container-1">
              <div className="form-group-1">
                <label className="form-label-1">ITEM UNITS</label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleInputChange}
                  className="form-input-1"
                />
              </div>
              <div className="form-group-1">
                <label className="form-label-1">FIXED PRICE</label>
                <input
                  type="number"
                  name="fixedPrice"
                  value={formData.fixedPrice}
                  onChange={handleInputChange}
                  className="form-input-1"
                />
              </div>
              <div className="form-group-1">
                <label className="form-label-1">RETAIL PRICE</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice}
                  onChange={handleInputChange}
                  className="form-input-1"
                />
              </div>
            </div>
            <div className="form-group-1">
              <label className="form-label-1">LOCATION</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-select-1"
              >
                <option value="">Select Location</option>
                <option value="Store">Store</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
            <div className="form-group-1">
              <label className="form-label-1">STORAGE AREA</label>
              <select
                name="storageArea"
                value={formData.storageArea}
                onChange={handleInputChange}
                className="form-select-1"
              >
                <option value="">Select Storage Area</option>
                <option value="Store 1st Floor">Store 1st Floor</option>
                <option value="Store 2nd Floor">Store 2nd Floor</option>
                <option value="AREA A">AREA A</option>
              </select>
            </div>

            <div className="form-group-1" style={{ display: "none" }}>
              <label className="form-label-1">USERNAME</label>
              <input
                type="text"
                name="username"
                value={storedValue}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
