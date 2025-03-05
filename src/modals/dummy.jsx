import React, { useState } from 'react';

const MultiModalForm = () => {
    const [currentModal, setCurrentModal] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        phone: '',
        notes: '',
    });

    const openModal = (modalName) => setCurrentModal(modalName);
    const closeModal = () => setCurrentModal(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Form submitted! Check console for data.');
        // You can replace this with an API call like:
        // fetch('/your-api-endpoint', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } });
    };

    return (
        <div>
            <button onClick={() => openModal('modal1')}>Start Form</button>

            {/* Modal 1 - Basic Info */}
            {currentModal === 'modal1' && (
                <div className="modal">
                    <h2>Modal 1 - Basic Info</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                    <button onClick={handleSubmit}>Submit Now</button>
                    <button onClick={() => openModal('modal2')}>Next</button>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}

            {/* Modal 2 - Contact Info */}
            {currentModal === 'modal2' && (
                <div className="modal">
                    <h2>Modal 2 - Contact Info</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <button onClick={handleSubmit}>Submit Now</button>
                    <button onClick={() => openModal('modal3')}>Next</button>
                    <button onClick={() => openModal('modal1')}>Back</button>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}

            {/* Modal 3 - Review & Notes */}
            {currentModal === 'modal3' && (
                <div className="modal">
                    <h2>Modal 3 - Review & Additional Notes</h2>
                    <textarea
                        name="notes"
                        placeholder="Additional Notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                    <button onClick={handleSubmit}>Submit Now</button>
                    <button onClick={() => openModal('modal2')}>Back</button>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
        </div>
    );
};

export default MultiModalForm;

















{/* Manual Fix */}

{currentModal === 'modal1' && (
    <div className="modal">
        <h2>Modal 1 - Basic Info</h2>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
        />
        <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit Now</button>
        <button onClick={() => openModal('modal2')}>Next</button>
        <button onClick={closeModal}>Close</button>
    </div>
)}

{/* Options */}


{currentModal === 'modal2' && (
    <div className="modal">
        <h2>Modal 1 - Basic Info</h2>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
        />
        <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit Now</button>
        <button onClick={() => openModal('modal2')}>Next</button>
        <button onClick={closeModal}>Close</button>
    </div>
)}


















<div className="modal-overlay-1">


{currentModal === 'modal1' && (
    <div className="modal">
        <h2>Modal 1 - Basic Info</h2>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
        />
        <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit Now</button>
        <button onClick={() => openModal('modal2')}>Next</button>
        <button onClick={closeModal}>Close</button>
    </div>
)}

      <div className="modal-container-1">
        <h2 className="modal-title-2">Stock History Fix</h2>
        <form onSubmit={handleSubmit} className="modal-form-1">
          {/* Image Upload Section */}
          <div className="image-upload-container-1">
            {imagePreview ? (
              <img
                src={`/src/backend/${imagePreview}`}
                alt="Preview"
                className="image-preview-1"
              />
            ) : (
              <div className="upload-placeholder-1">
                <label htmlFor="imageUpload" className="upload-button-1">
                  Click to upload image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input-1"
                  id="imageUpload"
                />
              </div>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-container-1">
            {/* Item Details */}
            <div className="form-group-1 full-width-1">
              <label className="form-label-1">Item Description</label>
              <p className="item-desc-1">{stock_name}</p>
            </div>

            <div className="form-group-1">
              <label className="form-label-1">Brand</label>
              <p className="item-brand-1">{itemBrand}</p>
            </div>

            <div className="form-group-1 full-width-1">
              <label className="form-label-1">Current Units</label>
              <p className="item-desc-1">{latestUnits}</p>
            </div>

            <div className="form-group-1 full-width-1">
              <label className="form-label-1">Units Before Change</label>
              <p className="item-desc-1">{prevUnits}</p>
            </div>

            <div className="form-group-1 full-width-1">
              <label className="form-label-1">Units After Change</label>
              <p className="item-desc-1">{oldCurrentUnits}</p>
            </div>


            {/* Units Added */}
           

            {/* Date Input */}
            <div className="form-group-1">
              <label className="form-label-1">Date</label>
              <input
                type="date"
                name="requisitionDate"
                onChange={handleInputChange}
                value={transactionDate}
                className="form-input-1"
              />
            </div>

            {/* Requisition Number */}
            <div className="form-group-1">
              <label className="form-label-1">Requisition #</label>
              <input
                type="number"
                name="requisitionNum"
                value={reqNum}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
                    {/* Requisition Number */}
                    <div className="form-group-1">
              <label className="form-label-1">Stock Inputed</label>
              <input
                type="number"
                name="stockInputed"
                value={unitsInputted}
                onChange={handleInputChange}
                className="form-input-1"
              />
            </div>
                {/* Stock Type */}
                <div className="form-group-1">
              <label className="form-label-1">Stock Type</label>
              <select  type="text"
                name="stockType"
                value={stockType}
                onChange={handleInputChange}
                className="form-input-1">

<option value="Stock Out">Stock Out</option>
<option value="Stock In">Stock In</option>

                </select>
             

        
               
            </div>

            {/* Hidden Fields */}
            <input type="hidden" name="username" value={storedValue} />
            <input type="hidden" name="itemId" value={itemId} />
            <input type="hidden" name="stockId" value={Id} />
            <input type="hidden" name="inputChanged" value={inputChanged} />


          </div>

          {/* Modal Actions (Buttons) */}
          <div className="modal-actions-1">
            <button type="submit" className="save-button-1">
              SAVE
            </button>

         
          
            <button type="button" onClick={onClose} className="cancel-button-1">
              CANCEL
            </button>
          </div>
        </form>
        <button className="save-button-1"   onClick={() => openFixOptionFunc()}>
              Options
            </button>
      </div>
    </div>