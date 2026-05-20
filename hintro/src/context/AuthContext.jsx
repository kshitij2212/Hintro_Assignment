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
    if (stored) return JSON.parse(stored);

    const initialData = [
      {
        id: 'fb_mock_1',
        userId: 'u2',
        rating: 2,
        feedbackType: 'areas_for_improvement',
        comment: 'Had issues with ...',
        createdAt: '2026-05-10T11:30:00.000Z'
      },
      {
        id: 'fb_mock_2',
        userId: 'u2',
        rating: 4,
        feedbackType: 'successes',
        comment: 'The boxy feature ...',
        createdAt: '2026-05-18T13:25:00.000Z'
      }
    ];

    localStorage.setItem('hintro_feedback', JSON.stringify(initialData));
    return initialData;
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
