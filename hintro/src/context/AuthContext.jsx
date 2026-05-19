import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, checkServerHealth } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('hintro_user_id') || null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [feedbackList, setFeedbackList] = useState(() => {
    const stored = localStorage.getItem('hintro_feedback');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const verifyServer = async () => {
      const isOnline = await checkServerHealth();
      setServerOnline(isOnline);
    };
    verifyServer();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setProfile(null);
        return;
      }
      setLoading(true);
      try {
        const data = await getProfile(currentUser);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);

  const login = (userId) => {
    setCurrentUser(userId);
    localStorage.setItem('hintro_user_id', userId);
  };

  const logout = () => {
    setCurrentUser(null);
    setProfile(null);
    localStorage.removeItem('hintro_user_id');
  };

  const submitFeedback = (rating, feedbackType, comment) => {
    const newFeedback = {
      id: `fb_${Date.now()}`,
      userId: currentUser,
      rating,
      feedbackType,
      comment,
      createdAt: new Date().toISOString()
    };
    const updated = [newFeedback, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('hintro_feedback', JSON.stringify(updated));
    return newFeedback;
  };

  const deleteFeedback = (feedbackId) => {
    const updated = feedbackList.filter(fb => fb.id !== feedbackId);
    setFeedbackList(updated);
    localStorage.setItem('hintro_feedback', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      profile,
      loading,
      login,
      logout,
      serverOnline,
      feedbackList,
      submitFeedback,
      deleteFeedback
    }}>
      {children}
    </AuthContext.Provider>
  );
};
