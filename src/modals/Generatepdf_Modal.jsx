import React, { useState, useEffect } from "react";
import {
  IoArrowBack,
  IoTrashOutline,
  IoDocumentTextOutline,
  IoCloseOutline,
} from "react-icons/io5";
import axios from "axios";

const SelectedItemsModal = ({
  selectedItems: initialSelectedItems,
  isOpen,
  onClose,
}) => {
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
      await axios.post(
        "http://localhost/DCH_Inventory_V2/src/backend/deselect_item.php",
        {
          inventory_Id: inventory_Id,
          isSelected: 0,
        }
      );

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

    // Get current date in a nicely formatted way
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Generate the printable content with improved design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DCH Inventory - Items Report</title>
          <style>
            /* Reset and base styles */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            html, body {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
              overflow-x: hidden;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              line-height: 1.5;
              background-color: #f0f4f8;
            }
            
            /* Header section */
            .report-container {
              min-height: 100vh;
              width: 100%;
              margin: 0;
              background: white;
              display: flex;
              flex-direction: column;
            }
            
            .report-header {
              background: linear-gradient(135deg, #1a365d 0%, #2a4365 50%, #2c5282 100%);
              color: white;
              padding: 24px 32px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .header-left {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            
            .header-logo {
              font-size: 28px;
              font-weight: 700;
              display: flex;
              align-items: center;
            }
            
            .logo-img {
              height: 40px;
              margin-right: 10px;
              background: white;
              border-radius: 8px;
              padding: 5px;
            }
            
            .report-header h1 {
              font-size: 26px;
              font-weight: 600;
              margin: 0;
              letter-spacing: 0.5px;
            }
            
            .report-meta {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            }
            
            .report-date {
              font-size: 14px;
              opacity: 0.9;
            }
            
            .report-id {
              font-size: 14px;
              background: rgba(255, 255, 255, 0.2);
              padding: 3px 10px;
              border-radius: 16px;
              margin-top: 5px;
            }
            
            /* Content section */
            .report-content {
              padding: 32px;
              flex: 1;
            }
            
            .report-summary {
              background-color: #ebf4ff;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 5px solid #3182ce;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .summary-text {
              font-size: 16px;
            }
            
            .summary-counts {
              display: flex;
              gap: 20px;
            }
            
            .count-box {
              background: white;
              padding: 10px 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              text-align: center;
            }
            
            .count-value {
              font-size: 22px;
              font-weight: 700;
              color: #2c5282;
            }
            
            .count-label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #718096;
            }
            
            /* Table styles */
            .table-container {
              overflow-x: auto;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              background: white;
            }
            
            thead tr {
              background-color: #e2e8f0;
            }
            
            th {
              font-weight: 600;
              color: #2c5282;
              padding: 16px;
              text-align: left;
              border-bottom: 2px solid #cbd5e0;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            
            td {
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: middle;
            }
            
            tr:nth-child(even) {
              background-color: #f7fafc;
            }
            
            tr:hover {
              background-color: #ebf8ff;
              transition: background-color 0.2s ease;
            }
            
            /* Image styles */
            .item-image {
              width: 60px;
              height: 60px;
              object-fit: contain;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
              background-color: white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              padding: 3px;
            }
            
            /* Category and brand tags */
            .category-tag {
              display: inline-block;
              padding: 4px 10px;
              background-color: #e6fffa;
              color: #2c7a7b;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .brand-tag {
              display: inline-block;
              padding: 4px 10px;
              background-color: #ebf4ff;
              color: #3182ce;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 500;
            }
            
            /* Quantity styles */
            .quantity {
              font-weight: 700;
              text-align: center;
              background-color: #f0f4f8;
              padding: 6px 10px;
              border-radius: 6px;
              width: fit-content;
            }
            
            .low-quantity {
              color: #e53e3e;
              background-color: #fff5f5;
            }
            
            .medium-quantity {
              color: #dd6b20;
              background-color: #fffaf0;
            }
            
            .high-quantity {
              color: #38a169;
              background-color: #f0fff4;
            }
            
            /* ID cell styling */
            .item-id {
              font-family: 'Courier New', monospace;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            
            /* Description styling */
            .item-description {
              line-height: 1.5;
            }
            
            .item-secondary-desc {
              font-size: 13px;
              color: #718096;
              margin-top: 4px;
            }
            
            /* Footer section */
            .report-footer {
              text-align: center;
              padding: 24px;
              color: #718096;
              font-size: 13px;
              border-top: 1px solid #e2e8f0;
              background-color: #f8fafc;
            }
            
            .footer-logo {
              font-weight: 700;
              color: #2d3748;
              margin-bottom: 10px;
            }
            
            .footer-links {
              margin-top: 12px;
            }
            
            .footer-links a {
              color: #4299e1;
              text-decoration: none;
              margin: 0 10px;
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
                background: #1a365d !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              thead tr {
                background-color: #e2e8f0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              tr:nth-child(even) {
                background-color: #f7fafc !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              tr:hover {
                background-color: inherit !important;
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
                background-color: #ebf4ff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .quantity, .low-quantity, .medium-quantity, .high-quantity {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <div class="header-left">
                    <div class="header-logo">
                <!-- DCH Logo as a regular image -->
                <img src="/src/assets/DCH.png" class="logo-img" alt="DCH Logo">
                <div>Inventory</div>
              </div>
              </div>
              <div class="report-meta">
                <div class="report-date">Generated: ${formattedDate}</div>
                <div class="report-id">Report ID: DCH-${currentDate.getTime().toString().substring(5, 13)}</div>
              </div>
            </div>
            
            <div class="report-content">
              <div class="report-summary">
                <div class="summary-text">
                  <strong>Inventory Report</strong> - A comprehensive list of inventory items that have been selected for review or action.
                </div>
                <div class="summary-counts">
                  <div class="count-box">
                    <div class="count-value">${selectedItems.length}</div>
                    <div class="count-label">Total Items</div>
                  </div>
                  <div class="count-box">
                    <div class="count-value">${selectedItems.reduce((acc, item) => acc + (parseInt(item.units) || 0), 0).toLocaleString()}</div>
                    <div class="count-label">Units</div>
                  </div>
                </div>
              </div>
              
              <div class="table-container">
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
                    ${selectedItems
                      .map((item, index) => {
                        // Determine quantity class based on item units
                        let quantityClass = "quantity";
                        const units = parseInt(item.units) || 0;
                        if (units < 10) quantityClass += " low-quantity";
                        else if (units < 30)
                          quantityClass += " medium-quantity";
                        else quantityClass += " high-quantity";

                        return `
                      <tr>
                        <td>${index + 1}</td>
                        <td><img class="item-image" src="/src/backend/${item.image}" alt="${item.itemDesc_1}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23CBD5E0\\' stroke-width=\\'1.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3E%3Crect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'%3E%3C/rect%3E%3Ccircle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'%3E%3C/circle%3E%3Cpolyline points=\\'21 15 16 10 5 21\\'%3E%3C/polyline%3E%3C/svg%3E'"/></td>
                        <td><div class="item-id">${item.inventory_Id}</div></td>
                        <td>
                          <div class="item-description">${item.itemDesc_1}</div>
                          ${item.itemDesc_2 ? `<div class="item-secondary-desc">${item.itemDesc_2}</div>` : ""}
                        </td>
                        <td>${item.brand ? `<span class="brand-tag">${item.brand}</span>` : "-"}</td>
                        <td>${item.category ? `<span class="category-tag">${item.category}</span>` : "-"}</td>
                        <td><div class="${quantityClass}">${units.toLocaleString()}</div></td>
                      </tr>
                    `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="report-footer">
              <div class="footer-logo">DCH Inventory Management System</div>
              <p>Report generated on ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}</p>
              <p>© ${currentDate.getFullYear()} DCH Inventory - All Rights Reserved</p>
              <div class="footer-links">
                <a href="#">Support</a>
                <a href="#">Documentation</a>
                <a href="#">Help Center</a>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              // Calculate total quantities
              const items = ${JSON.stringify(selectedItems)};
              
              // Force PDF to fill the entire screen/page
              document.querySelector('html').style.height = '100%';
              document.querySelector('body').style.height = '100%';
              document.querySelector('.report-container').style.minHeight = '100%';
              
              // Print automatically
              setTimeout(() => { 
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 500);
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
                <span className="rvs-selection-count">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
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
                      <tr
                        key={item.inventory_Id}
                        className={index % 2 === 0 ? "" : "odd-row"}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <div className="item-image-container">
                            <img
                              src={`/src/backend/${item.image}`}
                              alt={item.itemDesc_1}
                              className="rvs-item-image"
                              onError={(e) => {
                                e.target.src = "placeholder-image.jpg";
                              }}
                            />
                          </div>
                        </td>
                        <td className="item-id">{item.inventory_Id}</td>
                        <td>
                          {item.itemDesc_1 +
                            (item.itemDesc_2 ? " " + item.itemDesc_2 : "")}
                        </td>
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
