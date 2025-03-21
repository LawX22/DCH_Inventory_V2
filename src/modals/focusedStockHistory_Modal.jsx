import React, { useEffect, useState } from "react";
import axios from "axios";

const StockHistoryModal = ({ isOpen, onClose, inventory_Id }) => {
  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    if (isOpen && inventory_Id) {
      axios
        .get(`http://localhost/DCH_Inventory_V2/src/backend/load_focusedStockHistory.php?inventory_Id=${inventory_Id}`)
        .then((response) => {
          console.log("Stock History Data:", response.data);
          setStockHistory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching stock history:", error);
        });
    }
  }, [isOpen, inventory_Id]);
  

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Stock History for Inventory ID: {inventory_Id}</h2>

        {stockHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Units</th>
                <th>Requisition #</th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.transaction_date}</td>
                  <td>{history.transaction_type}</td>
                  <td>{history.	units_added}</td>
                  <td>{history.requisition_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No stock history found.</p>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StockHistoryModal;
