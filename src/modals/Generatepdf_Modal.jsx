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
    const printWindow = window.open("", "_blank", 'width=800,height=600');
    
    // Get current date in a nicely formatted way
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Generate the printable content with improved design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>DCH Inventory - Selected Items Report</title>
          <style>
            /* Reset and base styles */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              line-height: 1.5;
              padding: 30px;
              background-color: #f9f9f9;
            }
            
            /* Header section */
            .report-container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
              border-radius: 8px;
              overflow: hidden;
            }
            
            .report-header {
              background: linear-gradient(135deg, #344e85 0%, #4d6cb3 100%);
              color: white;
              padding: 20px 25px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #ddd;
            }
            
            .report-header h1 {
              font-size: 24px;
              font-weight: 600;
              margin: 0;
            }
            
            .report-date {
              font-size: 14px;
              opacity: 0.9;
            }
            
            /* Content section */
            .report-content {
              padding: 25px;
            }
            
            .report-summary {
              background-color: #f5f9ff;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
              border-left: 4px solid #344e85;
            }
            
            .report-summary p {
              margin: 0;
              font-size: 15px;
            }
            
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 14px;
            }
            
            thead tr {
              background-color: #f5f7fa;
            }
            
            th {
              font-weight: 600;
              color: #344e85;
              padding: 12px 15px;
              text-align: left;
              border-bottom: 2px solid #ddd;
            }
            
            td {
              padding: 12px 15px;
              border-bottom: 1px solid #eee;
              vertical-align: middle;
            }
            
            tr:nth-child(even) {
              background-color: #fafbfd;
            }
            
            tr:hover {
              background-color: #f0f4ff;
            }
            
            /* Image styles */
            .item-image {
              width: 50px;
              height: 50px;
              object-fit: contain;
              border-radius: 4px;
              border: 1px solid #ddd;
              background-color: white;
            }
            
            /* Category and brand tags */
            .category-tag {
              display: inline-block;
              padding: 3px 8px;
              background-color: #e3f0ff;
              color: #2c5282;
              border-radius: 12px;
              font-size: 12px;
            }
            
            .brand-tag {
              display: inline-block;
              padding: 3px 8px;
              background-color: #eff8ff;
              color: #3182ce;
              border-radius: 12px;
              font-size: 12px;
            }
            
            /* Quantity styles */
            .quantity {
              font-weight: 600;
              text-align: center;
            }
            
            /* Footer section */
            .report-footer {
              text-align: center;
              padding: 20px;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #eee;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                padding: 0;
                background: white;
              }
              
              .report-container {
                box-shadow: none;
                max-width: none;
              }
              
              .report-header {
                background: #344e85 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              thead tr {
                background-color: #f5f7fa !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              tr:nth-child(even) {
                background-color: #fafbfd !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .no-print {
                display: none;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              
              .report-summary {
                background-color: #f5f9ff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <h1>Selected Items Report</h1>
              <div class="report-date">Generated: ${formattedDate}</div>
            </div>
            
            <div class="report-content">
              <div class="report-summary">
                <p><strong>Total Items:</strong> ${selectedItems.length} | <strong>Report ID:</strong> DCH-${currentDate.getTime().toString().substring(5, 13)}</p>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 10%">Image</th>
                    <th style="width: 12%">ID</th>
                    <th style="width: 25%">Description</th>
                    <th style="width: 15%">Brand</th>
                    <th style="width: 18%">Category</th>
                    <th style="width: 15%">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedItems.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td><img class="item-image" src="/src/backend/${item.image}" alt="${item.itemDesc_1}" onerror="this.src='placeholder-image.jpg'"/></td>
                      <td><strong>${item.inventory_Id}</strong></td>
                      <td>${item.itemDesc_1} ${item.itemDesc_2 || ''}</td>
                      <td>${item.brand ? `<span class="brand-tag">${item.brand}</span>` : '-'}</td>
                      <td>${item.category ? `<span class="category-tag">${item.category}</span>` : '-'}</td>
                      <td class="quantity">${item.units || '0'}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            
            <div class="report-footer">
              <p>DCH Inventory Management System | Report generated on ${currentDate.toLocaleDateString()}</p>
              <p>© ${currentDate.getFullYear()} DCH Inventory - All Rights Reserved</p>
            </div>
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