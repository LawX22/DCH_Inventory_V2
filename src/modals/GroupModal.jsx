import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineClear } from "react-icons/ai";

function GroupModal({ isOpen, onClose, groupData }) {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [stockType, setStockType] = useState("Stock In");
  const [quantities, setQuantities] = useState({});
  const [localGroupData, setLocalGroupData] = useState([]);

  useEffect(() => {
    if (groupData.length > 0) {
      setLocalGroupData(groupData);
      const initialQuantities = {};
      groupData.forEach(item => {
        initialQuantities[item.inventory_Id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [groupData]);

  const handleQuantityChange = (inventoryId, value) => {
    setQuantities(prev => ({
      ...prev,
      [inventoryId]: value
    }));
  };

  const handleRemoveItem = (inventoryId) => {
    setLocalGroupData(prev => prev.filter(item => item.inventory_Id !== inventoryId));
    
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[inventoryId];
      return newQuantities;
    });
    
    console.log("Removing item:", inventoryId);
  };

  const handleClearAll = () => {
    setLocalGroupData([]);
    setQuantities({});
    console.log("Clearing all items");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      date,
      stockType,
      items: localGroupData.map(item => ({
        inventory_Id: item.inventory_Id,
        quantity: quantities[item.inventory_Id] || 1
      }))
    };
    
    console.log("Submitting form data:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-group">
      <div className="modal-container-group">
        <h2 className={`modal-title-group ${stockType === "Stock In" ? "stock-in" : "stock-out"}`}>
          Group Transaction
        </h2>
        
        <form className="modal-form-group" onSubmit={handleSubmit}>
          <div className="group-header-section">
            <div className="form-group-group">
              <label className="form-label-group">Transaction Date</label>
              <input 
                type="date" 
                className="form-input-group" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group-group">
              <label className="form-label-group">Transaction Type</label>
              <select 
                className="form-select-group" 
                value={stockType} 
                onChange={(e) => setStockType(e.target.value)}
              >
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
            </div>
          </div>
          
          {localGroupData.length > 0 ? (
            <>
              <div className="group-table-header">
                <h3 className="items-count">Items in transaction: {localGroupData.length}</h3>
                <button 
                  type="button" 
                  className="clear-all-button"
                  onClick={handleClearAll}
                >
                  <AiOutlineClear size={16} />
                  <span>Clear All</span>
                </button>
              </div>
              
              <div className="group-table-container">
                <table className="group-table">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Units Available</th>
                      <th>Brand</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localGroupData.map((item) => (
                      <tr key={item.inventory_Id}>
                        <td className="item-desc-cell">{item.itemDesc_1}</td>
                        <td className="item-units-cell">{item.units}</td>
                        <td className="item-brand-cell">{item.brand}</td>
                        <td className="item-quantity-cell">
                          <input 
                            type="number" 
                            className="quantity-input"
                            min="1"
                            max={item.units}
                            value={quantities[item.inventory_Id] || 1}
                            onChange={(e) => handleQuantityChange(item.inventory_Id, parseInt(e.target.value))}
                          />
                        </td>
                        <td className="item-actions-cell">
                          <button 
                            type="button" 
                            className="remove-button"
                            onClick={() => handleRemoveItem(item.inventory_Id)}
                          >
                            <AiOutlineDelete size={16} />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="no-data-message">
              <p>No items added to this group yet.</p>
            </div>
          )}
          
          <div className="modal-actions-group">
            <button 
              type="submit" 
              className="save-button-group"
              disabled={localGroupData.length === 0}
            >
              Process Transaction
            </button>
            <button 
              type="button" 
              className="cancel-button-group"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupModal;