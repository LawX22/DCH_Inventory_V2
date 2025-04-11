import React, { useState, useEffect } from "react";
import axios from "axios";

const ManualFixModal = ({ isOpen, onClose, data }) => {
  const [itemId, setItemId] = useState('');
  const [Id, setId] = useState('');
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
  const [imagePreview, setImagePreview] = useState(null);
  const [requisitionNum, setRequisitionNum] = useState('');
  const [requisitionDate, setRequisitionDate] = useState('');
  const [unitsAdded, setUnitsAdded] = useState('');
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);
  const [transactionDate, setTransactionDate] = useState('');
  const [unitsInputted, setUnitsInputted] = useState('');
  const [reqNum, setReqNum] = useState('');
  const [stockType, setStockType] = useState('');
  const [prevUnits, setPrevUnits] = useState('');
  const [latestUnits, setLatestUnits] = useState('');
  const [oldCurrentUnits, setOldCurrentUnits] = useState('');
  const [stock_name, setStockName] = useState('');
  const [inputChanged, setInputChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const username = localStorage.getItem("username") || "";

  // Populate form data when component receives data
  useEffect(() => {
    if (data) {
      setItemId(data.inventory_Id || '');
      setId(data.stock_history_id || '');
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
      setTransactionDate(data.transaction_date || '');
      setUnitsInputted(data.units_added || '');
      setReqNum(data.requisition_number || '');
      setStockType(data.transaction_type || '');
      setPrevUnits(data.previous_units || '');
      setOldCurrentUnits(data.current_stock || '');
      setStockName(data.stock_name || '');
    }
  }, [data]);
  
  // Fetch latest units
  useEffect(() => {
    if (itemId) {
      axios
        .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/get_latest_units.php", {
          params: { latest_unit_id: itemId },
        })
        .then((response) => {
          if (response.data.length > 0) {
            setLatestUnits(response.data[0].units);
            setImagePreview(response.data[0].image);
          } else {
            setLatestUnits(null);
          }
        })
        .catch((error) => console.error("Error fetching inventory:", error));
    }
  }, [itemId]);

  // Fetch brands
  useEffect(() => {
    axios.get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_brands.php")
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    axios.get("https://slategrey-stingray-471759.hostingersite.com/api/backend/list_category.php")
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Clean up image preview URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
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
      case "stockInputed":
        setUnitsAdded(value);
        setInputChanged(true);
        break;
      case "stockType":
        setStockType(value);
        setInputChanged(true);
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
    
    if (unitsAdded > units) {
      alert("Units added cannot be greater than the available units.");
      return;
    }
    
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("itemId", itemId);
    formDataToSend.append("Id", Id);
    formDataToSend.append("requisitionNum", requisitionNum || reqNum);
    formDataToSend.append("requisitionDate", requisitionDate || transactionDate);
    formDataToSend.append("unitsAdded", unitsAdded || unitsInputted);
    formDataToSend.append("username", username);
    formDataToSend.append("inputChanged", inputChanged);
    formDataToSend.append("stockType", stockType);

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
      alert("Failed to update item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mfm-modal-overlay">
      <div className="mfm-modal-container">
        <h2 className="mfm-modal-title">Manual Fix</h2>
        
        <form onSubmit={handleSubmit} className="mfm-modal-form">
          <div className="mfm-content-container">
            {/* Left column */}
            <div className="mfm-left-column">
              <div className="mfm-image-upload-container">
                {imagePreview ? (
                  <img
                    src={imagePreview.startsWith('blob:') ? imagePreview : `/src/backend/${imagePreview}`}
                    alt="Item Preview"
                    className="mfm-image-preview"
                  />
                ) : (
                  <div className="mfm-upload-placeholder">
                    <p className="mfm-upload-text">Upload item image</p>
                    <label htmlFor="imageUpload" className="mfm-upload-button">
                      Browse
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mfm-file-input"
                      id="imageUpload"
                    />
                  </div>
                )}
              </div>
              
              <div className="mfm-item-info">
                <div className="mfm-info-group">
                  <h3 className="mfm-info-title">Item Information</h3>
                  <div className="mfm-info-row">
                    <span className="mfm-info-label">Description:</span>
                    <span className="mfm-info-value">{stock_name}</span>
                  </div>
                  <div className="mfm-info-row">
                    <span className="mfm-info-label">Brand:</span>
                    <span className="mfm-info-value">{itemBrand}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="mfm-right-column">
              <div className="mfm-stock-info">
                <h3 className="mfm-section-title">Stock Information</h3>
                <div className="mfm-stock-detail">
                  <div className="mfm-stock-card">
                    <span className="mfm-stock-label">Current Units</span>
                    <span className="mfm-stock-value">{latestUnits}</span>
                  </div>
                  <div className="mfm-stock-card">
                    <span className="mfm-stock-label">Units Before Change</span>
                    <span className="mfm-stock-value">{prevUnits}</span>
                  </div>
                  <div className="mfm-stock-card">
                    <span className="mfm-stock-label">Units After Change</span>
                    <span className="mfm-stock-value">{oldCurrentUnits}</span>
                  </div>
                </div>
              </div>
              
              <div className="mfm-form-fields-container">
                <div className="mfm-form-group">
                  <label className="mfm-form-label">Date</label>
                  <input
                    type="date"
                    name="requisitionDate"
                    onChange={handleInputChange}
                    value={requisitionDate || transactionDate}
                    className="mfm-form-input"
                  />
                </div>
                
                <div className="mfm-form-group">
                  <label className="mfm-form-label">Requisition #</label>
                  <input
                    type="number"
                    name="requisitionNum"
                    value={requisitionNum || reqNum}
                    onChange={handleInputChange}
                    className="mfm-form-input"
                    placeholder="Enter requisition number"
                  />
                </div>
                
                <div className="mfm-form-group">
                  <label className="mfm-form-label">Stock Inputed</label>
                  <input
                    type="number"
                    name="stockInputed"
                    value={unitsAdded || unitsInputted}
                    onChange={handleInputChange}
                    className="mfm-form-input"
                    placeholder="Enter stock quantity"
                  />
                </div>
                
                <div className="mfm-form-group">
                  <label className="mfm-form-label">Stock Type</label>
                  <select
                    name="stockType"
                    value={stockType}
                    onChange={handleInputChange}
                    className="mfm-form-input"
                  >
                    <option value="Stock Out">Stock Out</option>
                    <option value="Stock In">Stock In</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Fields */}
          <input type="hidden" name="username" value={username} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="stockId" value={Id} />
          <input type="hidden" name="inputChanged" value={inputChanged} />

          {/* Modal Actions */}
          <div className="mfm-modal-actions">
            <button type="button" onClick={onClose} className="mfm-cancel-button">
              Cancel
            </button>
            <button type="submit" className="mfm-save-button" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualFixModal;