import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  getDashboardData,
  getCallSessionStats,
  getCallHistory
} from '../utils/api';
import {
  PieChart,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
  Menu,
  ChevronDown,
  Play,
  RotateCw,
  LogOut,
  UserCheck,
  HelpCircle,
  MoreVertical
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser, profile, loading: authLoading, login, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  
  const [loadingData, setLoadingData] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [limit, setLimit] = useState(4);
  const [connectingCalendar, setConnectingCalendar] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, authLoading, navigate]);

  const fetchData = async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const [dash, stats, history] = await Promise.all([
        getDashboardData(currentUser),
        getCallSessionStats(currentUser),
        getCallHistory(currentUser, limit)
      ]);
      setDashboardData(dash);
      setStatsData(stats);
      setHistoryData(history);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser, limit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (authLoading || !profile) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <RotateCw size={40} className="animate-spin" style={{ color: 'var(--primary)', animation: 'spin 1.5s linear infinite' }} />
          <h2 className="login-title">Loading Workspace...</h2>
        </div>
      </div>
    );
  }

  const formatAverageDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}sec`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}sec`;
    }
    return `${secs}sec`;
  };

  const formatRowDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0sec';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}sec`;
    }
    return `${secs}sec`;
  };

  const formatRelativeTime = (datesArray) => {
    if (!datesArray || datesArray.length === 0) return '-';
    const isoString = datesArray[0];
    const date = new Date(isoString);
    const now = new Date();
    
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = d2 - d1;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Active today';
    }
    if (diffDays === 1) {
      return '1 day ago';
    }
    if (diffDays > 1) {
      return `${diffDays} days ago`;
    }
    return '2 days ago';
  };

  const formatTime12hr = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const groupSessionsByDate = (sessions) => {
    if (!sessions || sessions.length === 0) return {};
    const groups = {};
    
    const addOrdinal = (day) => {
      if (day > 3 && day < 21) return day + 'th';
      switch (day % 10) {
        case 1:  return day + "st";
        case 2:  return day + "nd";
        case 3:  return day + "rd";
        default: return day + "th";
      }
    };
    
    const sorted = [...sessions].sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    
    sorted.forEach((session) => {
      const dateObj = new Date(session.started_at);
      const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
      const daySuffix = addOrdinal(dateObj.getDate());
      const groupKey = `${month} ${daySuffix}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(session);
    });
    
    return groups;
  };

  const getInitials = () => {
    const first = profile.firstName?.charAt(0) || '';
    const last = profile.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const handleStartCallSimulation = () => {
    setConnectingCalendar(true);
    setTimeout(() => {
      setConnectingCalendar(false);
    }, 1500);
  };

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isMobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="main-content" style={{ minWidth: 0 }}>
        <header className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setMobileSidebarOpen(true)} aria-label="Open sidebar">
              <Menu size={24} />
            </button>
            <span className="sidebar-logo">Hintro</span>
          </div>
          <div
            className="top-bar-avatar"
            style={{ width: '28px', height: '28px', fontSize: '10px', cursor: 'pointer' }}
            onClick={() => setLogoutModalOpen(true)}
          >
            {getInitials()}
          </div>
        </header>
        
        <div className="dashboard-top-bar">
          <span className="dashboard-page-title">Dashboard</span>
          
          <div className="dashboard-top-actions">
            <button className="btn-watch-tutorial" onClick={() => {}}>
              <Play size={13} fill="currentColor" />
              <span>Watch Tutorial</span>
            </button>

            <div
              className="top-bar-profile"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              ref={dropdownRef}
            >
              <div className="top-bar-avatar">{getInitials()}</div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />

              {showProfileDropdown && (
                <div className="profile-logout-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button className="logout-dropdown-item-btn" onClick={() => { setLogoutModalOpen(true); setShowProfileDropdown(false); }}>
                    <LogOut size={14} className="logout-icon" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        <main className="dashboard-page animate-fade-in">
          
          <div className="welcome-banner-card">
            <div className="welcome-banner-text">
              <h2>Hi, {profile.firstName} 👋 Welcome to Hintro</h2>
              <p>Ready to make your next call smarter ?</p>
            </div>
            <button className="btn-start-call" onClick={handleStartCallSimulation}>
              Start New Call
            </button>
          </div>

          <div className="kpi-row-grid">
            
            <div className="figma-kpi-card">
              <div className="kpi-avatar-icon icon-red-bg">
                <PieChart size={20} />
              </div>
              <div className="kpi-text-block">
                <span className="kpi-text-label">Total Sessions</span>
                <span className="kpi-text-val">{loadingData ? '...' : statsData?.totalSessions || 0}</span>
              </div>
            </div>

            <div className="figma-kpi-card">
              <div className="kpi-avatar-icon icon-blue-bg">
                <Clock size={20} />
              </div>
              <div className="kpi-text-block">
                <span className="kpi-text-label">Average Duration</span>
                <span className="kpi-text-val">
                  {loadingData ? '...' : formatAverageDuration(statsData?.averageDuration)}
                </span>
              </div>
            </div>

            <div className="figma-kpi-card">
              <div className="kpi-avatar-icon icon-green-bg">
                <Sparkles size={20} />
              </div>
              <div className="kpi-text-block">
                <span className="kpi-text-label">AI Used</span>
                <span className="kpi-text-val">
                  {loadingData ? '...' : (statsData?.totalAIInteractions ? `${statsData.totalAIInteractions} times` : '0')}
                </span>
              </div>
            </div>

            <div className="figma-kpi-card">
              <div className="kpi-avatar-icon icon-purple-bg">
                <Calendar size={20} />
              </div>
              <div className="kpi-text-block">
                <span className="kpi-text-label">Last Session</span>
                <span className="kpi-text-val">
                  {loadingData ? '...' : formatRelativeTime(statsData?.lastSession)}
                </span>
              </div>
            </div>

          </div>
          
          <h2 className="recent-calls-centered-title">Recent calls</h2>
          
          {loadingData ? (
            <div className="recent-calls-container-card">
              <RotateCw size={24} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <span className="empty-state-title">Retrieving recent calls...</span>
            </div>
          ) : currentUser === 'u1' || !historyData || historyData.callSessions.length === 0 ? (
            <div className="recent-calls-container-card">
              <div className="recent-calls-empty-illus">
                <Calendar size={20} />
              </div>
              <h3 className="empty-state-title">No Recent Calls</h3>
              <p className="empty-state-desc">
                Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
              </p>
              <button className="btn-start-a-call" onClick={handleStartCallSimulation} disabled={connectingCalendar}>
                {connectingCalendar ? 'Syncing...' : 'Start a Call'}
              </button>
            </div>
          ) : (
            <div className="sessions-list" style={{ width: '100%' }}>
              {Object.entries(groupSessionsByDate(historyData.callSessions)).map(([dateKey, sessions]) => (
                <div key={dateKey} className="recent-calls-group">
                  <div className="recent-calls-group-header">{dateKey}</div>
                  <div className="recent-calls-group-list">
                    {sessions.map((session) => (
                      <div key={session._id} className="figma-session-row">
                        <div className="session-left">
                          <div className="session-purple-icon">K</div>
                          <div className="session-text-col">
                            <span className="session-title-text">
                              {session.description || 'Design Call'}
                            </span>
                            <div className="avatar-stack">
                              <div className="stack-avatar" style={{ backgroundColor: '#93C5FD' }}>AJ</div>
                              <div className="stack-avatar" style={{ backgroundColor: '#FCA5A5' }}>CP</div>
                              <div className="stack-avatar" style={{ backgroundColor: '#E2E8F0' }}>+1</div>
                            </div>
                          </div>
                        </div>

                        <div className="session-right">
                          <span className="session-row-time">
                            {formatTime12hr(session.started_at)}
                          </span>
                          <button
                            className="session-row-action-btn"
                            onClick={() => {}}
                            aria-label="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}


            </div>
          )}



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
    </div>
  );
};

export default Dashboard;
