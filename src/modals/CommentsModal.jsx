import React, { useState } from 'react';
import { FaTimes, FaUser, FaCommentDots, FaPaperPlane } from 'react-icons/fa';

const CommentModal = ({ isOpen, onClose, requestId, comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(requestId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FaCommentDots />
            <h3>Comments for Request #{requestId}</h3>
          </div>
          <button className="modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div className="comment-item" key={index}>
                  <div className="comment-avatar">
                    <FaUser />
                  </div>
                  <div className="comment-content">
                    <div className="comment-author">{comment.user}</div>
                    <div className="comment-text">{comment.comment}</div>
                    <div className="comment-time">{comment.timestamp || 'Just now'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">No comments yet</div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <form onSubmit={handleSubmit} className="comment-form">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="comment-submit-button">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;