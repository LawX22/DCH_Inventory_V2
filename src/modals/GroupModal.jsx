import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineClear } from "react-icons/ai";

function GroupModal({ isOpen, onClose, groupData }) {
  const [date, setDate] = useState("");
  const [stockType, setStockType] = useState("Stock In");
  const [quantities, setQuantities] = useState({});
  const [localGroupData, setLocalGroupData] = useState([]);

  useEffect(() => {
    if (groupData.length > 0) {
      setLocalGroupData(groupData);
      const initialQuantities = {};
      groupData.forEach(item => {
        if (!initialQuantities[item.stock_group_id]) {
          initialQuantities[item.stock_group_id] = 1;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [groupData]);

  const handleQuantityChange = (stock_group_id, value) => {
    setQuantities(prev => ({
      ...prev,
      [stock_group_id]: value
    }));
  };

  const handleRemoveItem = (inventory_Id, stock_group_id) => {
    const updatedGroupData = localGroupData.filter(item => item.inventory_Id !== inventory_Id);
    setLocalGroupData(updatedGroupData);

    const stillExists = updatedGroupData.some(item => item.stock_group_id === stock_group_id);
    if (!stillExists) {
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[stock_group_id];
        return newQuantities;
      });
    }

    console.log("Removing item:", inventory_Id);
  };

  const handleClearAll = () => {
    setLocalGroupData([]);
    setQuantities({});
    console.log("Clearing all items");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const encoder = localStorage.getItem("username");
    const date_updated = new Date().toISOString().slice(0, 19).replace("T", " ");

    const itemsToSend = localGroupData.map(item => ({
      stock_group_id: item.stock_group_id,
      itemDesc_1: item.itemDesc_1,
      brand: item.brand,
      category: item.category,
      units: item.units,
      units_added: quantities[item.stock_group_id] || 1,
      transaction_date: date,
      transaction_type: stockType,
      date_updated: date_updated,
      encoder: encoder
    }));

    fetch("http://localhost/DCH_Inventory_V2/src/backend/groupStock.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemsToSend)
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Response from server:", res);
        if (res.status === "success") {
          alert("Transaction processed successfully!");
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error submitting transaction:", error);
        alert("An error occurred while processing the transaction.");
      });
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
                      <th>Item Group</th>
                      <th>Description</th>
                      <th>Brand</th>
                      <th>Units</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localGroupData.map((item) => (
                      <tr key={item.inventory_Id}>
                        <td className="item-desc-cell">{item.stock_group_id}</td>
                        <td className="item-desc-cell">{item.itemDesc_1 + item.itemDesc_2}</td>
                        <td className="item-units-cell">{item.brand}</td>
                        <td className="item-brand-cell">{item.units}</td>
                        <td className="item-quantity-cell">
                          <input
                            type="number"
                            className="quantity-input"
                            min="1"
                            max={item.units}
                            value={quantities[item.stock_group_id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(item.stock_group_id, parseInt(e.target.value))
                            }
                          />
                        </td>
                        <td className="item-actions-cell">
                          <button
                            type="button"
                            className="remove-button"
                            onClick={() =>
                              handleRemoveItem(item.inventory_Id, item.stock_group_id)
                            }
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
