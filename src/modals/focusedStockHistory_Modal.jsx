import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const FocusedStockHistoryModal = ({ isOpen, onClose, inventory_Id }) => {
  const [stockHistory, setStockHistory] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const modalRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    if (isOpen && inventory_Id) {
      fetchStockHistory();
      
      // Add escape key listener
      const handleEsc = (e) => {
        if (e.key === "Escape") handleClose();
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, inventory_Id]);

  // Add effect to apply filters automatically when filter values change
  useEffect(() => {
    if (isOpen && inventory_Id) {
      fetchStockHistory();
    }
  }, [filterDate, transactionType]);

  const fetchStockHistory = () => {
    setIsLoading(true);
    axios
      .get("https://slategrey-stingray-471759.hostingersite.com/api/backend/load_focusedStockHistory.php", {
        params: { 
          inventory_Id, 
          filterDate, 
          transactionType 
        },
      })
      .then((response) => {
        console.log("Stock History Data:", response.data);
        setStockHistory(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stock history:", error);
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    setFilterDate("");
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
        <title>Stock History Report - ID: ${inventory_Id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #b8d6eb; padding: 8px; text-align: left; }
          th { background-color: #e7ecf0; color: #333; font-weight: 600; }
          h2 { text-align: center; color: #25632b; margin-bottom: 5px; }
          .report-details { text-align: center; color: #666; margin-bottom: 20px; font-size: 14px; }
          .stock-in { background-color: rgba(189, 234, 193, 0.2); }
          .stock-out { background-color: rgba(255, 194, 194, 0.2); }
          @media print {
            th { background-color: #e7ecf0 !important; -webkit-print-color-adjust: exact; }
            .stock-in { background-color: rgba(189, 234, 193, 0.2) !important; -webkit-print-color-adjust: exact; }
            .stock-out { background-color: rgba(255, 194, 194, 0.2) !important; -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          .close-button { 
            margin-top: 20px;
            padding: 8px 16px;
            background: #4a6fa5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .close-button:hover {
            background: #365b8c;
          }
        </style>
      </head>
      <body>
        <h2>Stock History Report</h2>
        <div class="report-details">
          <p>Inventory ID: ${inventory_Id} | Generated: ${new Date().toLocaleString()}</p>
          ${filterDate ? `<p>Filter: Date ${filterDate}${transactionType ? ` | Type: ${transactionType}` : ''}</p>` : ''}
        </div>
        ${printContent}
        <div class="no-print" style="text-align: center;">
          <button class="close-button" onclick="window.print();">Print</button>
          <button class="close-button" onclick="window.close();">Close</button>
        </div>
        <script>
          // Automatically trigger print when content is loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportToExcel = () => {
    if (stockHistory.length === 0) {
      alert("No data to export!");
      return;
    }

    // Add metadata
    const exportData = stockHistory.map(item => ({
      ...item,
      // Ensure consistent data formatting
      transaction_date: new Date(item.transaction_date).toLocaleDateString(),
      units_added: Number(item.units_added)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockHistory");

    // Add header with metadata
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`Stock History for Inventory ID: ${inventory_Id}`],
      [`Generated: ${new Date().toLocaleString()}`],
      filterDate ? [`Filter: Date ${filterDate}${transactionType ? ` | Type: ${transactionType}` : ''}`] : [],
      [], // Empty row
    ], { origin: "A1" });

    XLSX.writeFile(workbook, `Stock_History_ID${inventory_Id}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const toggleFilters = () => {
    setFilterExpanded(!filterExpanded);
  };

  const getStockSummary = () => {
    if (stockHistory.length === 0) return null;
    
    const stockIn = stockHistory.filter(item => item.transaction_type === "Stock In")
      .reduce((sum, item) => sum + Number(item.units_added), 0);
    
    const stockOut = stockHistory.filter(item => item.transaction_type === "Stock Out")
      .reduce((sum, item) => sum + Number(item.units_added), 0);
    
    return { stockIn, stockOut, net: stockIn - stockOut };
  };

  if (!isOpen) return null;

  const summary = getStockSummary();

  return (
    <div 
      className="fsh-modal-overlay" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-history-modal-title"
    >
      <div 
        className="fsh-modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="fsh-modal-header">
          <h2 id="stock-history-modal-title">Stock History: ID {inventory_Id}</h2>
        </div>

        <div className="fsh-filters-section">
          <button 
            className={`fsh-filter-toggle ${filterExpanded ? 'expanded' : 'collapsed'}`}
            onClick={toggleFilters}
            aria-expanded={filterExpanded}
            aria-controls="filter-container"
          >
            {filterExpanded ? 'Hide Filters' : 'Show Filters'} 
            <span className="fsh-toggle-icon">{filterExpanded ? '▲' : '▼'}</span>
          </button>
          
          <div 
            id="filter-container" 
            className={`fsh-filters-container ${filterExpanded ? 'expanded' : 'collapsed'}`}
          >
            <div className="fsh-filter-group">
              <label htmlFor="filter-date">Date:</label>
              <input 
                id="filter-date"
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
                aria-label="Filter by date"
              />
            </div>
            <div className="fsh-filter-group">
              <label htmlFor="transaction-type">Transaction Type:</label>
              <select 
                id="transaction-type"
                value={transactionType} 
                onChange={(e) => setTransactionType(e.target.value)}
                aria-label="Filter by transaction type"
              >
                <option value="">All Types</option>
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="fsh-table-container">
          {isLoading ? (
            <div className="fsh-loading-spinner" aria-live="polite">
              <div className="fsh-spinner"></div>
              <p>Loading history data...</p>
            </div>
          ) : stockHistory.length > 0 ? (
            <>
              {summary && (
                <div className="fsh-summary-panel">
                  <div className="fsh-summary-item fsh-stock-in-summary">
                    <span className="fsh-summary-label">Total In:</span>
                    <span className="fsh-summary-value">{summary.stockIn}</span>
                  </div>
                  <div className="fsh-summary-item fsh-stock-out-summary">
                    <span className="fsh-summary-label">Total Out:</span>
                    <span className="fsh-summary-value">{summary.stockOut}</span>
                  </div>
                  <div className="fsh-summary-item fsh-net-summary">
                    <span className="fsh-summary-label">Net Change:</span>
                    <span className={`fsh-summary-value ${summary.net >= 0 ? 'positive' : 'negative'}`}>
                      {summary.net >= 0 ? '+' : ''}{summary.net}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="fsh-table-wrapper" ref={printRef}>
                <table className="fsh-stock-history-table" aria-label="Stock history transactions">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Action</th>
                      <th scope="col">Units</th>
                      <th scope="col">Requisition #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHistory.map((history, index) => (
                      <tr 
                        key={index} 
                        className={history.transaction_type === "Stock In" ? "fsh-stock-in" : "fsh-stock-out"}
                      >
                        <td>{new Date(history.transaction_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`fsh-transaction-badge ${history.transaction_type === "Stock In" ? "fsh-badge-in" : "fsh-badge-out"}`}>
                            {history.transaction_type}
                          </span>
                        </td>
                        <td>{history.units_added}</td>
                        <td>{history.requisition_number || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="fsh-no-data-message">
              <span className="fsh-no-data-icon">📋</span>
              <p>No stock history found for this inventory item.</p>
              {(filterDate || transactionType) && (
                <p>Try adjusting your filter criteria.</p>
              )}
            </div>
          )}
        </div>

        <div className="fsh-modal-footer">
          <button 
            className="fsh-action-button fsh-print-button" 
            onClick={handlePrint}
            disabled={stockHistory.length === 0}
            aria-label="Print report"
          >
            <span className="fsh-button-icon">📄</span> Print
          </button>
          <button 
            className="fsh-action-button fsh-export-button" 
            onClick={handleExportToExcel}
            disabled={stockHistory.length === 0}
            aria-label="Export to Excel"
          >
            <span className="fsh-button-icon">📊</span> Export
          </button>
          <button 
            className="fsh-action-button fsh-close-action-button" 
            onClick={handleClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusedStockHistoryModal;  