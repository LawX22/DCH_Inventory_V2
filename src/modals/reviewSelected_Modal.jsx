import React, { useState, useEffect } from "react";
import { IoArrowBack, IoTrashOutline, IoDocumentTextOutline, IoCloseOutline } from "react-icons/io5";
import axios from "axios";

const SelectedItemsModal = ({ selectedItems: initialSelectedItems, isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update selectedItems when initialSelectedItems changes
  useEffect(() => {
    setSelectedItems(initialSelectedItems);
  }, [initialSelectedItems]);

  if (!isOpen) return null;

  const handleRemove = async (inventory_Id) => {
    try {
      setIsLoading(true);
      // Send the update request to change isSelected to 0
      await axios.post("http://localhost/DCH_Inventory_V2/src/backend/deselect_item.php", {
        inventory_Id: inventory_Id,
        isSelected: 0,
      });
  
      // Update UI by filtering out the removed item
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item.inventory_Id !== inventory_Id)
      );
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    
    // Generate the printable content
    const htmlContent = `
      <html>
        <head>
          <title>Selected Items Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
            .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .report-header h2 { margin: 0; color: #333; }
            .report-date { color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f7fa; color: #444; }
            img { width: 40px; height: 40px; object-fit: contain; }
            .report-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h2>Selected Items Report</h2>
            <div class="report-date">Generated: ${new Date().toLocaleString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><img src="/src/backend/${item.image}" alt="Item" /></td>
                  <td>${item.inventory_Id}</td>
                  <td>${item.itemDesc_1} ${item.itemDesc_2 || ''}</td>
                  <td>${item.brand || '-'}</td>
                  <td>${item.category || '-'}</td>
                  <td>${item.units || '0'}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div class="report-footer">
            DCH Inventory System - ${new Date().toLocaleDateString()}
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `;
  
    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  return (
    <div className="rvs-modal-overlay">
      <div className="rvs-detail-modal">
        <div className="rvs-modal-header">
          <div className="rvs-header-left">
            <h2>Review Selected Items</h2>
          </div>
        </div>
        
        <div className="rvs-modal-content selected-items-content">
          {selectedItems.length === 0 ? (
            <div className="rvs-empty-state">
              <div className="rvs-empty-icon">
                <IoDocumentTextOutline size={48} />
              </div>
              <p>No items selected</p>
              <button onClick={onClose} className="rvs-btn rvs-btn-secondary">
                Return to Inventory
              </button>
            </div>
          ) : (
            <>
              <div className="rvs-selection-summary">
                <span className="rvs-selection-count">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
              </div>
              
              <div className="rvs-table-container">
                <table className="rvs-table selected-items-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={item.inventory_Id} className={index % 2 === 0 ? "" : "odd-row"}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="item-image-container">
                            <img
                              src={`/src/backend/${item.image}`}
                              alt={item.itemDesc_1}
                              className="rvs-item-image"
                              onError={(e) => {e.target.src = "placeholder-image.jpg"}}
                            />
                          </div>
                        </td>
                        <td className="item-id">{item.inventory_Id}</td>
                        <td>{item.itemDesc_1 + (item.itemDesc_2 ? " " + item.itemDesc_2 : "")}</td>
                        <td>{item.brand || "-"}</td>
                        <td>{item.category || "-"}</td>
                        <td className="item-quantity">{item.units || "0"}</td>
                        <td>
                          <button 
                            onClick={() => handleRemove(item.inventory_Id)}
                            className="remove-item-btn"
                            title="Remove item"
                            disabled={isLoading}
                          >
                            <IoTrashOutline size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        <div className="rvs-modal-footer">
          <button onClick={onClose} className="rvs-btn rvs-btn-secondary">
            Close
          </button>
          {selectedItems.length > 0 && (
            <button onClick={generatePDF} className="rvs-btn rvs-btn-primary">
              <IoDocumentTextOutline size={18} />
              Generate PDF Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsModal;