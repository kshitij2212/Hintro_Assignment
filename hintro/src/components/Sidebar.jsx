import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Grid,
  PhoneCall,
  FileText,
  MessageSquare,
  Sliders,
  History,
  Gift,
  Info,
  X
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import '../styles/Sidebar.css';

const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const { currentUser } = useAuth();

  const topMenuItems = [
    {
      name: 'Dashboard',
      icon: <Grid size={18} />,
      path: '/dashboard',
      action: () => navigate('/dashboard')
    },
    {
      name: 'Call Insights',
      icon: <PhoneCall size={18} />,
      path: '#insights',
      action: () => {}
    },
    {
      name: 'Knowledge Base',
      icon: <FileText size={18} />,
      path: '#kb',
      hasInfo: true,
      action: () => {}
    },
    {
      name: 'Prompts',
      icon: <MessageSquare size={18} />,
      path: '#prompts',
      hasInfo: true,
      action: () => {}
    },
    {
      name: 'Boxy Controls',
      icon: <Sliders size={18} />,
      path: '#controls',
      hasInfo: true,
      action: () => {}
    }
  ];

  const bottomMenuItems = [
    {
      name: 'Feedback History',
      icon: <History size={18} />,
      path: '/feedback-history',
      action: () => navigate('/feedback-history')
    },
    {
      name: 'Feedback',
      icon: <Gift size={18} />,
      path: '#feedback',
      action: () => {
        setFeedbackOpen(true);
        if (setMobileOpen) setMobileOpen(false);
      }
    }
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>
      )}

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-section">
          <span className="sidebar-logo">Hintro</span>
          {isMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-menu-wrapper">
          <div className="sidebar-group">
            {topMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={item.action}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.hasInfo && (
                    <span className="sidebar-info-badge">
                      <Info size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="sidebar-group">
            {bottomMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={item.action}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            <div className="sidebar-usage-card">
              {currentUser === 'u2' ? '14' : '0'} of 1000 hours used
            </div>

            <button 
              className="sidebar-upgrade-btn" 
              onClick={() => {}}
            >
              Upgrade
            </button>

            <div className="sidebar-footer">
              <span>© 2025 Hintro. Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </aside>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
};

export default Sidebar;
