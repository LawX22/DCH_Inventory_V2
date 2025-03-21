import React from "react";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";


const SelectedItemsModal = ({ selectedItems, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Convert image URL to Base64
  const getBase64Image = async (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };


  const handleRemove = async (inventory_Id) => {
    try {
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
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            img { width: 40px; height: 40px; }
          </style>
        </head>
        <body>
          <h2>Selected Items Report</h2>
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
                  <td><img src="/src/backend/${item.image}" alt="Item Image" /></td>
                  <td>${item.inventory_Id}</td>
                  <td>${item.itemDesc_1} ${item.itemDesc_2}</td>
                  <td>${item.brand}</td>
                  <td>${item.category}</td>
                  <td>${item.units}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
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
    <div className="modal-overlay">
      <div className="modal-content" style={{overflow:"scroll", maxHeight:"500px"}}>
        <h2>Review Selected Items</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Remove</th>

            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={item.inventory_Id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={`/src/backend/${item.image}`}
                    alt={item.name}
                    className="item-image"
                    style={{ width: "40px", height: "40px" }}
                  />
                </td>
                <td>{item.inventory_Id}</td>
                <td>{item.itemDesc_1 + " " + item.itemDesc_2}</td>
                <td>{item.brand}</td>
                <td>{item.category}</td>
                <td>{item.units}</td>
                <button onClick={() => handleRemove(item.inventory_Id)}>Remove</button>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-footer" style={{position:"static",bottom:"10px",backgroundColor:"red"}}>
          <button onClick={generatePDF} className="btn btn-primary">
            Convert to PDF
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsModal;
