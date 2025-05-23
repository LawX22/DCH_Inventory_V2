  import React, { useState, useEffect } from "react";
  import axios from "axios";

  const StockOutModal = ({ isOpen, onClose, data }) => {
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
    const [requisitionNum, setRequisitionNum] = useState("");
    const [requisitionDate, setRequisitionDate] = useState("");
    const [unitsAdded, setUnitsAdded] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [stockId, setStockId] = useState(null);
    const [connector_id, setConnector] = useState(null);
    
    const username = localStorage.getItem("username") || "";

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
        setStockId(data.new_stock_id || "");
        setConnector(data.connector_id || "");
      }
    }, [data]);

    useEffect(() => {
      return () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      switch (name) {
        case "requisitionNum":
          setRequisitionNum(value);
          break;
        case "requisitionDate":
          setRequisitionDate(value);
          break;
        case "unitsAdded":
          setUnitsAdded(value);
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
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate that units being removed don't exceed available units
      // if (Number(unitsAdded) > Number(units)) {
      //   alert("Units removed cannot be greater than the available units.");
      //   return;
      // }
    
      const formDataToSend = new FormData();
      formDataToSend.append("itemId", itemId);
      formDataToSend.append("requisitionNum", requisitionNum);
      formDataToSend.append("requisitionDate", requisitionDate);
      formDataToSend.append("unitsAdded", unitsAdded);
      formDataToSend.append("username", username);
      formDataToSend.append("stockId", stockId);
      formDataToSend.append("connector_id", connector_id);
    
      try {
        const response = await axios.post(
          "https://slategrey-stingray-471759.hostingersite.com/api/backend/stockOut_inventory.php",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
    
        alert(response.data.message);
        onClose();
      } catch (error) {
        console.error("Error updating item:", error.response?.data || error);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay-1" onClick={(e) => {
        // Close the modal when clicking outside the content area
        if (e.target.className === "modal-overlay-1") {
          onClose();
        }
      }}>
        <div className="modal-container-1">
          <h2 className="modal-title-2">Stock Out Item</h2>
          <form onSubmit={handleSubmit} className="modal-form-1">
            <div className="modal-content-container">
              {/* Image Upload Section */}
              <div className="image-upload-container-1">
                {imagePreview ? (
                  <img
                    src={`/src/backend/${imagePreview}`}
                    alt="Item Preview"
                    className="image-preview-1"
                  />
                ) : (
                  <div className="upload-placeholder-1">
                    <i className="fa fa-image" style={{ fontSize: "32px", color: "#ffc2c2" }}></i>
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
                {/* Item Details Section */}
                <div className="item-details-section stockout">
                  <div className="form-group-1 full-width-1">
                    <label className="form-label-1">Item Description</label>
                    <p className="item-desc-1">{itemDesc1 + " " + itemDesc2}</p>
                  </div>

                  <div className="form-group-1">
                    <label className="form-label-1">Brand</label>
                    <p className="item-brand-1">{itemBrand}</p>
                  </div>
                  
                  <div className="form-group-1">
                    <label className="form-label-1">Available Units</label>
                    <p className="item-brand-1">{units}</p>
                  </div>
                </div>

                {/* Units Added */}
                <div className="form-group-1">
                  <label className="form-label-1">Units Removed</label>
                  <input
                    type="number"
                    name="unitsAdded"
                    value={unitsAdded}
                    onChange={handleInputChange}
                    className="form-input-1"
                    required
                  />
                </div>

                {/* Date Input */}
                <div className="form-group-1">
                  <label className="form-label-1">Date</label>
                  <input
                    type="date"
                    name="requisitionDate"
                    value={requisitionDate}
                    onChange={handleInputChange}
                    className="form-input-1"
                    required
                    autoComplete="off"
                    style={{ position: "relative", zIndex: 1 }}
                  />
                </div>

                {/* Requisition Number */}
                <div className="form-group-1 full-width-1">
                  <label className="form-label-1">Requisition #</label>
                  <input
                    type="text"
                    name="requisitionNum"
                    value={requisitionNum}
                    onChange={handleInputChange}
                    className="form-input-1"
                    
                  />
                </div>
              </div>
            </div>
            
            {/* Hidden Fields */}
            <input type="hidden" name="username" value={username} />
            <input type="hidden" name="itemId" value={itemId} />
            <input type="hidden" name="stockId" value={stockId} />
            <input  name="connector_id" value={connector_id}/>

            {/* Modal Actions (Buttons) */}
            <div className="modal-actions-1">
              <button type="submit" className="save-button-1">
                SAVE
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="cancel-button-1"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default StockOutModal;