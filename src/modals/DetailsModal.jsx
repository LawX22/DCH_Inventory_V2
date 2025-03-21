import React from "react";
import { FaComments } from "react-icons/fa";

const DetailsModal = ({ isOpen, onClose, request, openCommentModal }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="detail-header">
            <div className="detail-id">{request.id}</div>
            <div className={`detail-status ${request.status.toLowerCase()}`}>
              {request.status}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Item Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Description</div>
                <div className="detail-value">{request.description}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Type</div>
                <div className="detail-value">{request.type}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Item Code</div>
                <div className="detail-value">{request.itemCode}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Quantity</div>
                <div className="detail-value">{request.quantity}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Unit Price</div>
                <div className="detail-value">${request.price.toFixed(2)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Amount</div>
                <div className="detail-value">${request.amountDue.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Request Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Requester</div>
                <div className="detail-value">{request.requester}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Date Requested</div>
                <div className="detail-value">{request.date}</div>
              </div>
            </div>
          </div>
        
        </div>
        
        <div className="modal-footer">
          <button className="action-button view-button" onClick={() => {
            onClose();
            openCommentModal(request.id);
          }}>
            <FaComments /> Add Comment
          </button>
          <button className="action-button approve-button">
            Request Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;