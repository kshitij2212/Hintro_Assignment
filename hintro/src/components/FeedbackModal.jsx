import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Star, Check, Send } from 'lucide-react';
import '../styles/FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const { submitFeedback } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const lowRatingTags = [
    'Voice recognition accuracy',
    'Transcription latency',
    'AI response relevance',
    'UI/UX flow issues',
    'Integration bugs',
    'Other'
  ];

  const highRatingTags = [
    'Fast transcription',
    'Smart AI suggestions',
    'Clean dashboard interface',
    'Smooth integrations',
    'Voice accuracy',
    'Other'
  ];

  const handleStarClick = (rate) => {
    setRating(rate);
    setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const feedbackType = rating >= 4 ? 'successes' : 'areas_for_improvement';
    const combinedComment = [
      selectedTags.length > 0 ? `Tags: [${selectedTags.join(', ')}]` : '',
      comment.trim()
    ].filter(Boolean).join('\nDetail: ');

    submitFeedback(rating, feedbackType, combinedComment);
    setSubmitted(true);

    setTimeout(() => {
      setRating(0);
      setSelectedTags([]);
      setComment('');
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="feedback-header">
              <h2 className="feedback-title">Rate Hintro</h2>
              <p className="feedback-subtitle">Your feedback helps us build the future of AI interview intelligence</p>
            </div>

            <div className="star-rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star size={36} fill={(hoverRating || rating) >= star ? '#FBBF24' : 'none'} strokeWidth={1.5} />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="feedback-branch-section">
                {rating <= 3 ? (
                  <>
                    <span className="branch-prompt">What went wrong? (Select all that apply)</span>
                    <div className="pill-grid">
                      {lowRatingTags.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`feedback-pill ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <span className="branch-prompt">Can you share more details?</span>
                  </>
                ) : (
                  <>
                    <span className="branch-prompt">What did you like most? (Select all that apply)</span>
                    <div className="pill-grid">
                      {highRatingTags.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`feedback-pill ${selectedTags.includes(tag) ? 'selected' : ''}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <span className="branch-prompt">Anything else you'd like to share?</span>
                  </>
                )}

                <textarea
                  className="comment-textarea"
                  placeholder="Type your comments here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="feedback-submit-btn" disabled={rating === 0}>
              <Send size={16} />
              <span>Submit Feedback</span>
            </button>
          </form>
        ) : (
          <div className="success-animation-container">
            <div className="checkmark-circle">
              <Check size={36} />
            </div>
            <h2 className="success-message">Thank You!</h2>
            <p className="success-submessage">Your feedback has been successfully submitted and stored.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
