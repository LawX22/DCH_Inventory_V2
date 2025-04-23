import React, { useState, useEffect } from "react";
import axios from "axios";
import ManualFixModal from "../modals/stockHistory_ManualFix_Modal";


const SelectFixOpModal = ({ isOpen, onClose, data}) => {
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
  const user = localStorage.getItem("username");
  const [username, setusername] = useState(user);

  const [imagePreview, setImagePreview] = useState(null);
  const [requisitionNum, setrequisitionNum] = useState([]);
  const [requisitionDate, setrequisitionDate] = useState([]); 
  const [unitsAdded, setunitsAdded] = useState([]);
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
  const [manualFixModalOpen, setManualFixModalOpen] = useState(false);  
  const [selectedData, setSelectedData] = useState([]);  
 
  function openManualFixFunc(data){
    setSelectedData(data);
    setManualFixModalOpen(true);
  }

  // Fetch brand data from backend when component mounts
  useEffect(() => {
    if (data) {
      setItemId(data.inventory_Id || '');
      setId(data.stock_history_id  || '');
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
  }, [data]); // Add dependency to ensure it runs when `data` changes

  useEffect(() => {
    axios
        .get("http://localhost/DCH_Inventory_V2/src/backend/get_latest_units.php", {
            params: { latest_unit_id: itemId },
        })
        .then((response) => {
            if (response.data.length > 0) {
                setLatestUnits(response.data[0].units);
                setImagePreview(response.data[0].image)
            } else {
                setLatestUnits(null);  // or any default value you want
            }
        })
        .catch((error) => console.error("Error fetching inventory:", error));
  }, [itemId]);

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
      case "stockId":
        setId(value);
        break;
      case "requisitionNum":
        setrequisitionNum(value);  // ✅ FIXED
        break;
      case "requisitionDate":
        setrequisitionDate(value);
        break;
      case "stockInputed":
        setunitsAdded(value);
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
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    if(unitsAdded > units){
      alert("Units added cannot be greater than the available units.");
      return;
    }
    else{
      e.preventDefault();
  
      console.log("Date before sending:", requisitionDate); // Debugging
    
      const formDataToSend = new FormData();
      formDataToSend.append("itemId", itemId);
      formDataToSend.append("Id", Id);
      formDataToSend.append("requisitionNum", requisitionNum);
      formDataToSend.append("requisitionDate", requisitionDate);
      formDataToSend.append("unitsAdded", unitsAdded);
      formDataToSend.append("username", username);
      formDataToSend.append("inputChanged", inputChanged);
      formDataToSend.append("stockType", stockType);
  
      try {
        const response = await axios.post(
          "http://localhost/DCH_Inventory_V2/src/backend/stockOut_inventory.php",
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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-sop">
      <div className="modal-container-sop">
        <ManualFixModal
                isOpen={manualFixModalOpen}
                onClose={() => setManualFixModalOpen(false)}
                data={selectedData}
              />
        <div className="modal-title-sop">
          <h2>ALERT!</h2>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-sop">
          {/* Image Upload Section */}
          <div className="sidebar-section-sop">
            <div className="image-upload-container-sop">
              {imagePreview ? (
                <img
                  src={`/src/backend/${imagePreview}`}
                  alt="Preview"
                  className="image-preview-sop"
                />
              ) : (
                <div className="upload-placeholder-sop">
                  <div className="upload-icon-sop">📁</div>
                  <div className="upload-text-sop">Click to upload image</div>
                  <label htmlFor="imageUpload" className="upload-button-sop">
                    Select File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input-sop"
                    id="imageUpload"
                  />
                </div>
              )}
            </div>
            
            {/* Item Summary Container */}
            <div className="item-summary-container-sop">
              <div className="item-summary-header-sop">
                <h3>Item Summary</h3>
              </div>
              <div className="item-summary-content-sop">
                <div className="summary-row-sop">
                  <div className="summary-label-sop">Item:</div>
                  <div className="summary-value-sop">{stock_name}</div>
                </div>
                <div className="summary-row-sop">
                  <div className="summary-label-sop">Units:</div>
                  <div className="summary-value-sop">{units}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-container-sop">
            {/* Alert Message */}
            <div className="form-section-sop">
              <div className="section-title-sop">Alert</div>
              <div className="form-group-sop">
                <p>You have changed the stock value or transaction type of this entry. Do you want to change the unit value of {stock_name}?</p>
              </div>
            </div>
            
            {/* Transaction Details */}
            <div className="form-section-sop">
              <div className="section-title-sop">Transaction Details</div>
              <div className="transaction-grid-sop">
                <div className="form-group-sop">
                  <label className="form-label-sop">Transaction Date</label>
                  <input
                    type="date"
                    name="requisitionDate"
                    onChange={handleInputChange}
                    value={transactionDate}
                    className="form-input-sop"
                  />
                </div>
                
                <div className="form-group-sop">
                  <label className="form-label-sop">Requisition Number</label>
                  <input
                    type="text"
                    name="requisitionNum"
                    value={reqNum}
                    onChange={handleInputChange}
                    className="form-input-sop"
                  />
                </div>
                
                <div className="form-group-sop">
                  <label className="form-label-sop">Units</label>
                  <input
                    type="text"
                    name="stockInputed"
                    value={unitsInputted}
                    onChange={handleInputChange}
                    className="form-input-sop"
                  />
                </div>
                
                <div className="form-group-sop">
                  <label className="form-label-sop">Transaction Type</label>
                  <input  
                    type="text"
                    name="stockType"
                    value={stockType}
                    onChange={handleInputChange}
                    className="form-input-sop"
                  />
                </div>
              </div>
            </div>

            {/* Hidden Fields */}
            <input type="hidden" name="username" value={storedValue} />
            <input type="hidden" name="itemId" value={itemId} />
            <input type="hidden" name="stockId" value={Id} />
            <input type="hidden" name="inputChanged" value={inputChanged} />
          </div>
        </form>

        {/* Modal Actions (Buttons) */}
        <div className="modal-actions-sop">
          <button type="submit" className="save-button-sop" onClick={handleSubmit}>
            DO NOT CHANGE
          </button>
          <button type="button" onClick={onClose} className="options-button-sop">
            AUTO FIX
          </button>
          <button type="button" onClick={() => openManualFixFunc(data)} className="cancel-button-sop">
            MANUALLY FIX
          </button>
          <button type="button" onClick={onClose} className="cancel-button-sop">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectFixOpModal;