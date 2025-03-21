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
} from "react-icons/fa";
import Header from "./Header";
import CommentModal from "../modals/CommentsModal";

const RequestBoard = () => {
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

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

  // Find the active request's comments
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

        <button className="export-button">
          <FaFileExport /> Export
        </button>

        <button className="activity-button">
          <FaHistory /> Activity
        </button>
      </div>

      {/* Main Request Table */}
      <div className="request-table">
        <div className="table-header">
          <div className="header-cell">Request</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Quantity</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {requestsData.map((request) => (
            <div className="table-row" key={request.id}>
              <div className="item-cell">
                <div className="item-image-container">
                  <FaClipboardList className="item-image" />
                </div>
                <div className="item-details">
                  <div className="item-name">{request.description}</div>
                  <div className="item-category">{request.type}</div>
                  <div className="item-id">
                    ID: {request.id} | Requester: {request.requester}
                  </div>
                </div>
              </div>

              <div className="status-cell">
                <div className={`status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </div>
              </div>

              <div className="price-cell">
                <div>${request.price.toFixed(2)}</div>
                <div>Due: ${request.amountDue.toFixed(2)}</div>
              </div>

              <div className="units-cell">
                <div>{request.quantity}</div>
                <div>units</div>
              </div>

              <div className="date-cell">
                <div>{request.date}</div>
                <div>{request.itemCode}</div>
              </div>

              <div className="actions-cell">
                <button
                  className="action-button view-button"
                  onClick={() => openCommentModal(request.id)}
                >
                  <div className="action-icon">
                    <FaComments />
                  </div>
                  Comment{" "}
                  {request.comments.length > 0 &&
                    `(${request.comments.length})`}
                </button>
                <button className="action-button approve-button">
                  Request approval
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        requestId={activeRequestId}
        comments={activeComments}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default RequestBoard;
