import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectFixOpModal from "../modals/stockHistory_Select_Option";
import ManualFixModal from "../modals/stockHistory_ManualFix_Modal";

const StockHistoryFixModal = ({ isOpen, onClose, data }) => {
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
  const [Id, setId] = useState("");

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
  const [requisitionNum, setrequisitionNum] = useState([]);
  const [requisitionDate, setrequisitionDate] = useState([]);
  const [unitsAdded, setunitsAdded] = useState("");
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);

  const [transactionDate, setTransactionDate] = useState("");
  const [unitsInputted, setUnitsInputted] = useState("");
  const [reqNum, setReqNum] = useState("");
  const [stockType, setStockType] = useState("");
  const [prevUnits, setPrevUnits] = useState("");
  const [latestUnits, setLatestUnits] = useState("");
  const [oldCurrentUnits, setOldCurrentUnits] = useState("");
  const [stock_name, setStockName] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [selectOpModalOpen, setSelectOpModalOpen] = useState("");
  const [manualFixModalOpen, setManualFixModalOpen] = useState(false);

  const [selectedData, setSelectedData] = useState([]);

  function openFixOptionFunc(data) {
    setSelectedData(data);
    setSelectOpModalOpen(true);
  }

  function openManualFixFunc() {
    setManualFixModalOpen(true);
  }
  
  // Fetch data when component mounts
  useEffect(() => {
    if (data) {
      setItemId(data.inventory_Id || "");
      setId(data.stock_history_id || "");
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
      setTransactionDate(data.transaction_date || "");
      setUnitsInputted(data.units_added || "");
      setReqNum(data.requisition_number || "");
      setStockType(data.transaction_type || "");
      setPrevUnits(data.previous_units || "");
      setOldCurrentUnits(data.current_stock || "");
      setStockName(data.stock_name || "");
    }
  }, [data]);

  useEffect(() => {
    axios
      .get(
        "http://localhost/DCH_Inventory_V2/src/backend/get_latest_units.php",
        {
          params: { latest_unit_id: itemId },
        }
      )
      .then((response) => {
        if (response.data.length > 0) {
          setLatestUnits(response.data[0].units);
          setImagePreview(response.data[0].image);
        } else {
          setLatestUnits(null);
        }
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [itemId]);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_brands.php")
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/list_category.php")
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
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
        setReqNum(value);
        break;
      case "requisitionDate":
        setTransactionDate(value);
        break;
      case "stockInputed":
        setUnitsInputted(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputChanged === true) {
      alert("You changed values. Please confirm your changes.");
      return;
    }

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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-shm">
      <div className="modal-container-shm">
        <SelectFixOpModal
          isOpen={selectOpModalOpen}
          onClose={() => setSelectOpModalOpen(false)}
          data={selectedData}
        />

        <div className="modal-title-shm">
          <h2>Stock History Fix</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form-shm">
          <div className="sidebar-section-shm">
            {/* Image Upload Section */}
            <div className="image-upload-container-shm">
              {imagePreview ? (
                <img
                  src={`/src/backend/${imagePreview}`}
                  alt="Preview"
                  className="image-preview-shm"
                />
              ) : (
                <div className="upload-placeholder-shm">
                  <div className="upload-icon-shm">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <div className="upload-text-shm">No image available</div>
                  <label htmlFor="imageUpload" className="upload-button-shm">
                    Upload image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input-shm"
                    id="imageUpload"
                  />
                </div>
              )}
            </div>
            
            <div className="item-summary-container-shm">
              <div className="item-summary-header-shm">
                <h3>Item Summary</h3>
              </div>
              <div className="item-summary-content-shm">
                <div className="summary-row-shm">
                  <span className="summary-label-shm">Item:</span>
                  <span className="summary-value-shm">{stock_name}</span>
                </div>
                <div className="summary-row-shm">
                  <span className="summary-label-shm">Brand:</span>
                  <span className="summary-value-shm">{itemBrand}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-container-shm">
            <div className="form-section-shm">
              <h3 className="section-title-shm">Units Information</h3>
              
              <div className="units-grid-shm">
                <div className="form-group-shm">
                  <label className="form-label-shm">Current Units</label>
                  <div className="units-display-shm">{latestUnits}</div>
                </div>
                
                <div className="form-group-shm">
                  <label className="form-label-shm">Units Before Change</label>
                  <div className="units-display-shm">{prevUnits}</div>
                </div>
                
                <div className="form-group-shm">
                  <label className="form-label-shm">Units After Change</label>
                  <div className="units-display-shm">{oldCurrentUnits}</div>
                </div>
              </div>
            </div>

            <div className="form-section-shm">
              <h3 className="section-title-shm">Transaction Details</h3>
              
              <div className="transaction-grid-shm">
                <div className="form-group-shm">
                  <label className="form-label-shm">Date</label>
                  <input
                    type="date"
                    name="requisitionDate"
                    onChange={handleInputChange}
                    value={transactionDate}
                    className="form-input-shm"
                  />
                </div>
                
                <div className="form-group-shm">
                  <label className="form-label-shm">Requisition #</label>
                  <input
                    type="number"
                    name="requisitionNum"
                    value={reqNum}
                    onChange={handleInputChange}
                    className="form-input-shm"
                  />
                </div>
                
                <div className="form-group-shm">
                  <label className="form-label-shm">Stock Inputed</label>
                  <input
                    type="number"
                    name="stockInputed"
                    value={unitsInputted}
                    onChange={handleInputChange}
                    className="form-input-shm"
                  />
                </div>
                
                <div className="form-group-shm">
                  <label className="form-label-shm">Stock Type</label>
                  <select
                    name="stockType"
                    value={stockType}
                    onChange={handleInputChange}
                    className="form-select-shm"
                  >
                    <option value="Stock Out">Stock Out</option>
                    <option value="Stock In">Stock In</option>
                  </select>
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
        
        <div className="modal-actions-shm">
          <button type="button" onClick={openFixOptionFunc} className="options-button-shm">
            Options
          </button>
          <button type="button" onClick={handleSubmit} className="save-button-shm">
            Save Changes
          </button>
          <button type="button" onClick={onClose} className="cancel-button-shm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryFixModal;