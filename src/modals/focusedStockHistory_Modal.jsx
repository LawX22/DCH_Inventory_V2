import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const StockHistoryModal = ({ isOpen, onClose, inventory_Id }) => {
  const [stockHistory, setStockHistory] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    if (isOpen && inventory_Id) {
      fetchStockHistory();
    }
  }, [isOpen, inventory_Id, minDate, maxDate, transactionType]);

  const fetchStockHistory = () => {
    axios
      .get("http://localhost/DCH_Inventory_V2/src/backend/load_focusedStockHistory.php", {
        params: { inventory_Id, minDate, maxDate, transactionType },
      })
      .then((response) => {
        console.log("Stock History Data:", response.data);
        setStockHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock history:", error);
      });
  };

  const handleClose = () => {
    setMinDate("");
    setMaxDate("");
    setTransactionType("");
    onClose();
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Stock History</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>Stock History Report</h2>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleExportToExcel = () => {
    if (stockHistory.length === 0) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(stockHistory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockHistory");

    XLSX.writeFile(workbook, `Stock_History_${inventory_Id}.xlsx`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Stock History for Inventory ID: {inventory_Id}</h2>

        {/* 🔽 Filters Section */}
        <div className="filters">
          <label>
            Min Date:
            <input type="date" value={minDate} onChange={(e) => setMinDate(e.target.value)} />
          </label>
          <label>
            Max Date:
            <input type="date" value={maxDate} onChange={(e) => setMaxDate(e.target.value)} />
          </label>
          <label>
            Transaction Type:
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="">All</option>
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
            </select>
          </label>
          <button onClick={fetchStockHistory}>Apply Filters</button>
        </div>

        {/* 🔽 Table Display (For Printing & Exporting) */}
        <div ref={printRef}>
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
                    <td>{history.units_added}</td>
                    <td>{history.requisition_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No stock history found.</p>
          )}
        </div>

        {/* 🔽 Buttons */}
        <div className="modal-buttons">
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleExportToExcel}>Export to Excel</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;
