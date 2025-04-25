import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";

function GroupModal({ isOpen, onClose, groupData }) {
  const [date, setDate] = useState("");
  const [reqnum, setReqnum] = useState(""); // Requisition Number state
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
    setQuantities(prev => ({ ...prev, [stock_group_id]: value }));
  };

  const handleRemoveItem = (stock_group_id) => {
    fetch("https://slategrey-stingray-471759.hostingersite.com/api/backend/deleteGroup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock_group_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const updatedGroupData = localGroupData.filter(
            (item) => item.stock_group_id !== stock_group_id
          );
          setLocalGroupData(updatedGroupData);
          setQuantities((prev) => {
            const newQuantities = { ...prev };
            delete newQuantities[stock_group_id];
            return newQuantities;
          });
          console.log("Successfully deleted group:", stock_group_id);
        } else {
          console.error("Server error:", data.message);
          alert(`Could not delete from database. Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Something went wrong while trying to delete the item.");
      });
  };

  const handleClearAll = () => {
    setLocalGroupData([]);
    setQuantities({});
    console.log("Clearing all items");
  };

  const handleShowData = () => {
    const user = localStorage.getItem("username"); // Fetching username from localStorage
    const dataToSend = {
      date,
      stockType,
      reqnum,
      user: user || "Unknown", // Default to "Unknown" if no username is found
      items: localGroupData.map((item) => ({
        id: item.stock_group_id,
        description: item.itemDesc_1 + item.itemDesc_2,
        brand: item.brand,
        units: item.units,
        quantity: quantities[item.stock_group_id] || 1, // Default to 1 if not changed
      })),
    };
    
    console.log("Data to submit:", dataToSend); // Log the data to check if it's structured as expected
    
    // Send data to PHP backend using fetch
    fetch("https://slategrey-stingray-471759.hostingersite.com/api/backend/groupStock.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure this header is set to indicate JSON
      },
      body: JSON.stringify(dataToSend), // Send the data as JSON
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Stock history updated successfully!");
          onClose(); // Close the modal after successful submission
        } else {
          alert(`Failed to update stock history: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Something went wrong while submitting the data.");
      });
    
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-group">
      <div className="modal-container-group">
        <h2
          className={`modal-title-group ${stockType === "Stock In" ? "stock-in" : "stock-out"}`}
        >
          Group Transaction
        </h2>

        <div className="modal-form-group">
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
              <label className="form-label-group">Requisition Number</label>
              <input
                type="text"
                className="form-input-group"
                value={reqnum}
                onChange={(e) => setReqnum(e.target.value)} // Handle Requisition Number
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
                      <td className="item-brand-cell">{item.brand}</td>
                      <td className="item-units-cell">{item.units}</td>
                      <td className="item-quantity-cell">
                        <input
                          type="number"
                          className="quantity-input"
                          onChange={(e) => handleQuantityChange(item.stock_group_id, e.target.value)}
                        />
                      </td>
                      <td className="item-actions-cell">
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => handleRemoveItem(item.stock_group_id)}
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
          ) : (
            <div className="no-data-message">
              <p>No items added to this group yet.</p>
            </div>
          )}

          <div className="modal-actions-group">
            <button
              type="button"
              className="show-data-button"
              onClick={handleShowData}
            >
              Submit Data
            </button>
            <button
              type="button"
              className="cancel-button-group"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupModal;
