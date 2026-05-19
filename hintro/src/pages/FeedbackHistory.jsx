import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, ChevronDown, Clock, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FeedbackModal from '../components/FeedbackModal';
import '../styles/FeedbackHistory.css';
import '../styles/Dashboard.css';

const FeedbackHistory = () => {
  const { feedbackList, profile, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userFeedback = feedbackList.filter(fb => fb.userId === currentUser);

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (isoString) => {
    if (!isoString) return '19th May 2026';
    const date = new Date(isoString);
    const day = date.getDate();
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}${suffix} ${month} ${year}`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return '5:00 pm';
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="app-container">
      
      <Sidebar isMobileOpen={isMobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="main-content" style={{ minWidth: 0 }}>
        
        <header className="mobile-header">
          <button onClick={() => setMobileSidebarOpen(true)} aria-label="Open sidebar" className="mobile-menu-btn">
            <Menu size={24} />
          </button>
          <span className="mobile-header-title">Feedback History</span>
          <div
            className="top-bar-avatar"
            style={{ width: '28px', height: '28px', fontSize: '10px', cursor: 'pointer' }}
            onClick={() => setLogoutModalOpen(true)}
          >
            {getInitials()}
          </div>
        </header>
        
        <div className="dashboard-top-bar">
          <span className="dashboard-page-title">Feedback History</span>
          
          <div className="dashboard-top-actions">
            <button className="btn-watch-tutorial" onClick={() => {}}>
              <Play size={13} fill="currentColor" />
              <span>Watch Tutorial</span>
            </button>

            <div
              className="top-bar-profile"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="top-bar-avatar">{getInitials()}</div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />

              {showProfileDropdown && (
                <div className="profile-logout-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button className="logout-dropdown-item-btn" onClick={() => { setLogoutModalOpen(true); setShowProfileDropdown(false); }}>
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="dashboard-scroll-area">
          <div className="dashboard-content-wrapper" style={{ marginTop: '16px' }}>
            <span className="feedback-subtitle">Browse your previous feedback submissions</span>

            {userFeedback.length === 0 ? (
              
              <div className="feedback-empty-card">
                <div className="feedback-empty-header-row">
                  <div className="table-th flex-2">Title</div>
                  <div className="table-th flex-1">Rating</div>
                  <div className="table-th flex-3">Description</div>
                  <div className="table-th flex-2">Date</div>
                  <div className="table-th flex-1">Time</div>
                </div>
                
                <div className="feedback-empty-content">
                  <span className="empty-title-text">No feedbacks yet</span>
                  <button 
                    type="button" 
                    className="btn-give-feedback-empty"
                    onClick={() => setFeedbackOpen(true)}
                  >
                    Give Feedback
                  </button>
                </div>
              </div>

            ) : (

              <div className="feedback-table-container">
                <div className="feedback-table-header">
                  <div className="table-th flex-2">Title</div>
                  <div className="table-th flex-1">Rating</div>
                  <div className="table-th flex-3">Description</div>
                  <div className="table-th flex-2">Date</div>
                  <div className="table-th flex-1">Time</div>
                </div>
                
                <div className="feedback-table-body">
                  {userFeedback.map((fb, idx) => (
                    <div key={fb.id || idx} className="feedback-table-row">
                      <div className="table-td flex-2 td-title">My First Call</div>
                      <div className="table-td flex-1 td-rating">{fb.rating}/5</div>
                      <div className="table-td flex-3 td-desc">
                        - {fb.comment || (fb.feedbackType === 'successes' ? 'The voice recognition was outstanding!' : 'Need minor latency optimizations.')}
                      </div>
                      <div className="table-td flex-2 td-date">{formatDate(fb.createdAt)}</div>
                      <div className="table-td flex-1 td-time">{formatTime(fb.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </div>

            )}

          </div>
        </main>
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal-overlay" onClick={() => setLogoutModalOpen(false)}>
          <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="logout-modal-title">Leaving already?</h2>
            <p className="logout-modal-subtitle">
              You can log back in anytime to continue your meetings with Hintro.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn-logout"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} />

    </div>
  );
};

export default FeedbackHistory;
