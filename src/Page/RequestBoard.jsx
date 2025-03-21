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
  FaInfoCircle
} from "react-icons/fa";
import Header from "./Header";
import CommentModal from "../modals/CommentsModal";
import DetailModal from "../modals/DetailsModal";

const RequestBoard = () => {
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [layoutType, setLayoutType] = useState("square"); // 'square' or 'rectangular'

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

  const toggleLayout = () => {
    setLayoutType(layoutType === "square" ? "rectangular" : "square");
  };

  // Find the active request
  const activeRequest = requestsData.find((req) => req.id === activeRequestId);
  const activeComments = activeRequest ? activeRequest.comments : [];

  return (
    <div className="request-container">
      <Header />

      {/* Action Panel */}
      <div className="action-panel">
        <button
          className="add-button"
          onClick={() =>
            window.open("/List_Restock", "_blank", "noopener,noreferrer")
          }
        >
          <FaPlus /> New Request
        </button>

        <div className="search-container">
          <div className="search-icon">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search requests..."
            className="search-input"
          />
        </div>

        <div className="warehouse-dropdown">
          <select className="dropdown-select">
            <option value="all">Status Filter</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="warehouse-dropdown">
          <select className="dropdown-select">
            <option value="all">Date Filter</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Layout Toggle Button */}
        <button className="layout-toggle-button" onClick={toggleLayout}>
          {layoutType === "square" ? <FaThList /> : <FaTh />}
          {layoutType === "square" ? "Rectangular" : "Square"}
        </button>

        <button className="export-button">
          <FaFileExport /> Export
        </button>

        <button className="activity-button">
          <FaHistory /> Activity
        </button>
      </div>

      {/* Card-based Request Layout */}
      <div className={`request-cards-container ${layoutType}`}>
        {requestsData.map((request) => (
          <div className={`request-card ${layoutType}`} key={request.id}>
            {/* Card Header */}
            <div className="card-header">
              <span className="request-id">{request.id}</span>
              <div className="header-right">
                {layoutType === "square" && (
                  <button 
                    className="view-details-icon" 
                    onClick={() => openDetailModal(request.id)}
                    title="View full details"
                  >
                    <FaEye />
                  </button>
                )}
                <div className={`status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </div>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="card-content">
              <div className="item-image-container">
                <FaClipboardList className="item-image" />
              </div>
              
              <div className="item-details">
                <span className="item-name">{request.description}</span>
                
                <div className="item-description">
                  <div className="item-info">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{request.type}</span>
                  </div>
                  
                  <div className="item-info">
                    <span className="info-label">Quantity:</span>
                    <span className="info-value">{request.quantity}</span>
                  </div>
                  
                  <div className="item-info">
                    <span className="info-label">Price:</span>
                    <span className="info-value">${request.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="item-info">
                    <span className="info-label">Total:</span>
                    <span className="info-value">${request.amountDue.toFixed(2)}</span>
                  </div>
                  
                  {layoutType === "rectangular" && (
                    <>
                      <div className="item-info">
                        <span className="info-label">Item Code:</span>
                        <span className="info-value">{request.itemCode}</span>
                      </div>
                      
                      <div className="item-info">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{request.date}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="card-footer">
              <div className="requester">
                <FaUser />
                <span className="requester-name">{request.requester}</span>
              </div>
              
              <div className="item-actions">
                <button 
                  className="action-button view-button"
                  onClick={() => openCommentModal(request.id)}
                >
                  <FaComments />
                  Comments
                  {request.comments.length > 0 && (
                    <span className="comment-count">{request.comments.length}</span>
                  )}
                </button>
                
                <button className="action-button approve-button">
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
    </div>
  );
};

export default RequestBoard;