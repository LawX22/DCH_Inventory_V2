import React from "react";

const InventoryModal = ({
  isOpen,
  onClose,
  formData = {},
  setFormData,
  handleInputChange,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">ADD NEW ITEM</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            {/* Image Upload Container */}
            <div className="image-upload-container">
              {formData.image && typeof formData.image === "object" ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-text">Click to upload image</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="upload-button cursor-pointer"
                  >
                    Browse
                  </label>
                </div>
              )}
            </div>

            {/* Modal Actions (Buttons in a Row) */}
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

          {/* Form Fields */}
          <div className="form-fields-container">
            <div className="form-group full-width">
              <label className="form-label">ITEM CODE</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode || ""}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ITEM BRAND</label>
              <select
                name="itemBrand"
                value={formData.itemBrand || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Brand</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ITEM CATEGORY</label>
              <select
                name="itemCategory"
                value={formData.itemCategory || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Category</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">DESCRIPTION 1</label>
              <input
                type="text"
                name="description1"
                value={formData.description1 || ""}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">DESCRIPTION 2</label>
              <input
                type="text"
                name="description2"
                value={formData.description2 || ""}
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
                  value={formData.units || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">FIXED PRICE</label>
                <input
                  type="number"
                  name="fixedPrice"
                  value={formData.fixedPrice || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">RETAIL PRICE</label>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">LOCATION</label>
              <select
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Location</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">STORAGE AREA</label>
              <select
                name="storageArea"
                value={formData.storageArea || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Storage Area</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
