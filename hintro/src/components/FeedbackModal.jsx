import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, X, ArrowLeft } from 'lucide-react';
import '../styles/FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const { submitFeedback } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const feedbackType = rating >= 4 ? 'successes' : 'areas_for_improvement';
    submitFeedback(rating, feedbackType, comment.trim());
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setSubmitted(false);
    onClose();
  };

  const getPrompt = () => {
    if (rating >= 4) return 'What did you like the most?';
    return 'What frustrated you or felt confusing?';
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="feedback-header">
              <h2 className="feedback-title">Give Feedback</h2>
              <p className="feedback-subtitle">Describe your experience using Hintro...</p>
            </div>

            <div className="star-rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={48}
                    fill={(hoverRating || rating) >= star ? '#FBBF24' : '#E5E7EB'}
                    strokeWidth={0}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="feedback-branch-section">
                <span className="branch-prompt">{getPrompt()}</span>
                <textarea
                  className="comment-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}

            <div className="feedback-actions">
              <button type="button" className="feedback-back-btn" onClick={handleClose}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button type="submit" className="feedback-submit-btn" disabled={rating === 0}>
                <span>Submit</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="success-state-container">
            <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
              <X size={24} />
            </button>
            <div className="success-icon-wrapper">
              <div className="success-icon-outer">
                <div className="success-icon-inner">
                  <Star size={40} fill="#FBBF24" strokeWidth={0} />
                </div>
              </div>
            </div>
            <h2 className="success-message">Thank you for your feedback!!</h2>
            <p className="success-submessage">
              Our team reviews every suggestion to improve AI responses, workflows, and overall experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
