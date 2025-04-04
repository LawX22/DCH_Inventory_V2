import React, { useState } from "react";
import {
  FaSearch,
  FaComments,
  FaShareAlt,
  FaClipboardList,
  FaPlus,
  FaFileExport,
  FaHistory,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaBox,
  FaDollarSign,
  FaRegClock,
  FaTh,
  FaThList,
  FaEye,
  FaInfoCircle,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import Header from "./Header";
import CommentModal from "../modals/CommentsModal";
import DetailModal from "../modals/DetailsModal";

const RequestBoard = () => {
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [layoutType, setLayoutType] = useState("square"); // 'square' or 'rectangular'
  const [isApprovalConfirmOpen, setIsApprovalConfirmOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);

  const requests = [
    {
      id: "REQ-2025-001",
      requester: "John Doe",
      status: "Pending",
      date: "2025-03-21",
      description: "Office supplies",
      type: "Equipment",
      quantity: 5,
      price: 120.0,
      amountDue: 120.0,
      itemCode: "OS-2025-001",
      comments: [
        {
          user: "Support Agent",
          comment: "Processing your request",
          timestamp: "2025-03-21 09:15 AM",
        },
        {
          user: "John Doe",
          comment: "Thank you",
          timestamp: "2025-03-21 10:30 AM",
        },
      ],
    },
    {
      id: "REQ-2025-002",
      requester: "Jane Smith",
      status: "Approved",
      date: "2025-03-20",
      description: "Software license",
      type: "Digital",
      quantity: 1,
      price: 299.99,
      amountDue: 299.99,
      itemCode: "SL-2025-042",
      comments: [
        {
          user: "Support Agent",
          comment: "Your license has been approved",
          timestamp: "2025-03-20 14:22 PM",
        },
      ],
    },
    {
      id: "REQ-2025-003",
      requester: "Mark Lee",
      status: "Pending",
      date: "2025-03-19",
      description: "Conference room chairs",
      type: "Furniture",
      quantity: 8,
      price: 89.99,
      amountDue: 719.92,
      itemCode: "FR-2025-018",
      comments: [],
    },
  ];

  const [requestsData, setRequestsData] = useState(requests);

  const openCommentModal = (requestId) => {
    setActiveRequestId(requestId);
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setActiveRequestId(null);
  };

  const openDetailModal = (requestId) => {
    setActiveRequestId(requestId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setActiveRequestId(null);
  };

  const openApprovalConfirm = (requestId) => {
    setRequestToApprove(requestId);
    setIsApprovalConfirmOpen(true);
  };

  const closeApprovalConfirm = () => {
    setIsApprovalConfirmOpen(false);
    setRequestToApprove(null);
  };

  const handleAddComment = (requestId, commentText) => {
    // Add new comment
    const updatedRequests = requestsData.map((request) => {
      if (request.id === requestId) {
        return {
          ...request,
          comments: [
            ...request.comments,
            {
              user: "Current User", // Replace with actual logged-in user
              comment: commentText,
              timestamp: new Date().toLocaleString(),
            },
          ],
        };
      }
      return request;
    });

    setRequestsData(updatedRequests);
  };

  const handleApproveRequest = () => {
    // Update request status to Approved
    const updatedRequests = requestsData.map((request) => {
      if (request.id === requestToApprove) {
        return {
          ...request,
          status: "Approved",
          comments: [
            ...request.comments,
            {
              user: "Current User", // Replace with actual logged-in user
              comment: "Request approved",
              timestamp: new Date().toLocaleString(),
            },
          ],
        };
      }
      return request;
    });

    setRequestsData(updatedRequests);
    closeApprovalConfirm();
  };

  const handleCancelRequest = () => {
    // Update request status to Rejected
    const updatedRequests = requestsData.map((request) => {
      if (request.id === requestToApprove) {
        return {
          ...request,
          status: "Rejected",
          comments: [
            ...request.comments,
            {
              user: "Current User", // Replace with actual logged-in user
              comment: "Request cancelled",
              timestamp: new Date().toLocaleString(),
            },
          ],
        };
      }
      return request;
    });

    setRequestsData(updatedRequests);
    closeApprovalConfirm();
  };

  const toggleLayout = () => {
    setLayoutType(layoutType === "square" ? "rectangular" : "square");
  };

  // Find the active request
  const activeRequest = requestsData.find((req) => req.id === activeRequestId);
  const activeComments = activeRequest ? activeRequest.comments : [];
  const requestToApproveData = requestsData.find((req) => req.id === requestToApprove);

  return (
    <div className="rqb-request-container">
      <Header />

      {/* Action Panel */}
      <div className="rqb-action-panel">
        <button
          className="rqb-add-button"
          onClick={() =>
            window.open("/List_Restock", "_blank", "noopener,noreferrer")
          }
        >
          <FaPlus /> New Request
        </button>

        <div className="rqb-search-container">
          <div className="rqb-search-icon">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search requests..."
            className="rqb-search-input"
          />
        </div>

        <div className="rqb-warehouse-dropdown">
          <select className="rqb-dropdown-select">
            <option value="all">Status Filter</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="rqb-warehouse-dropdown">
          <select className="rqb-dropdown-select">
            <option value="all">Date Filter</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Layout Toggle Button */}
        <button className="rqb-layout-toggle-button" onClick={toggleLayout}>
          {layoutType === "square" ? <FaThList /> : <FaTh />}
          {layoutType === "square" ? "Rectangular" : "Square"}
        </button>

        <button className="rqb-export-button">
          <FaFileExport /> Export
        </button>

        <button className="rqb-activity-button">
          <FaHistory /> Activity
        </button>
      </div>

      {/* Card-based Request Layout */}
      <div className={`rqb-request-cards-container ${layoutType}`}>
        {requestsData.map((request) => (
          <div className={`rqb-request-card ${layoutType}`} key={request.id}>
            {/* Card Header */}
            <div className="rqb-card-header">
              <span className="rqb-request-id">{request.id}</span>
              <div className="rqb-header-right">
                {layoutType === "square" && (
                  <button 
                    className="rqb-view-details-icon" 
                    onClick={() => openDetailModal(request.id)}
                    title="View full details"
                  >
                    <FaEye />
                  </button>
                )}
                <div className={`rqb-status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </div>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="rqb-card-content">
              <div className="rqb-item-image-container">
                <FaClipboardList className="rqb-item-image" />
              </div>
              
              <div className="rqb-item-details">
                <span className="rqb-item-name">{request.description}</span>
                
                <div className="rqb-item-description">
                  <div className="rqb-item-info">
                    <span className="rqb-info-label">Type:</span>
                    <span className="rqb-info-value">{request.type}</span>
                  </div>
                  
                  <div className="rqb-item-info">
                    <span className="rqb-info-label">Quantity:</span>
                    <span className="rqb-info-value">{request.quantity}</span>
                  </div>
                  
                  <div className="rqb-item-info">
                    <span className="rqb-info-label">Price:</span>
                    <span className="rqb-info-value">${request.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="rqb-item-info">
                    <span className="rqb-info-label">Total:</span>
                    <span className="rqb-info-value">${request.amountDue.toFixed(2)}</span>
                  </div>
                  
                  {layoutType === "rectangular" && (
                    <>
                      <div className="rqb-item-info">
                        <span className="rqb-info-label">Item Code:</span>
                        <span className="rqb-info-value">{request.itemCode}</span>
                      </div>
                      
                      <div className="rqb-item-info">
                        <span className="rqb-info-label">Date:</span>
                        <span className="rqb-info-value">{request.date}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="rqb-card-footer">
              <div className="rqb-requester">
                <FaUser />
                <span className="rqb-requester-name">{request.requester}</span>
              </div>
              
              <div className="rqb-item-actions">
                <button 
                  className="rqb-action-button rqb-view-button"
                  onClick={() => openCommentModal(request.id)}
                >
                  <FaComments />
                  Comments
                  {request.comments.length > 0 && (
                    <span className="rqb-comment-count">{request.comments.length}</span>
                  )}
                </button>
                
                <button 
                  className="rqb-action-button rqb-approve-button"
                  onClick={() => openApprovalConfirm(request.id)}
                  disabled={request.status === "Approved" || request.status === "Rejected"}
                >
                  Request approval
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        requestId={activeRequestId}
        comments={activeComments}
        onAddComment={handleAddComment}
      />

      {/* Detail Modal */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        request={activeRequest}
        openCommentModal={openCommentModal}
      />

      {/* Approval Confirmation Modal */}
      {isApprovalConfirmOpen && requestToApproveData && (
        <div className="rqb-approval-modal-overlay">
          <div className="rqb-approval-modal">
            <div className="rqb-approval-modal-header">
              <h3>Confirm Request Action</h3>
              <button className="rqb-close-button" onClick={closeApprovalConfirm}>×</button>
            </div>
            <div className="rqb-approval-modal-content">
              <p>Do you want to approve or cancel request <strong>{requestToApproveData.id}</strong>?</p>
              <p className="rqb-request-details">
                <strong>{requestToApproveData.description}</strong> - 
                {requestToApproveData.quantity} {requestToApproveData.quantity > 1 ? 'items' : 'item'} - 
                Total: ${requestToApproveData.amountDue.toFixed(2)}
              </p>
            </div>
            <div className="rqb-approval-modal-actions">
              <button 
                className="rqb-cancel-request-button" 
                onClick={handleCancelRequest}
              >
                <FaTimes /> Cancel Request
              </button>
              <button 
                className="rqb-approve-request-button" 
                onClick={handleApproveRequest}
              >
                <FaCheck /> Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBoard;