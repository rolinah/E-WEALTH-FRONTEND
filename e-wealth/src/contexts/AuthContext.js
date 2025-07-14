import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppState } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // const currentUser = await api.getCurrentUser();
        // setUser(currentUser);
        setUser(null); // Always force unauthenticated on app start
      } catch (error) {
        console.error('Error initializing user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    console.log('[AuthContext] user:', user, 'loading:', loading, 'isAuthenticated:', !!user);
  }, [user, loading]);

  // Auto-logout on app background/close
  /*
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        signOut();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);
  */

  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      await api.signUp(email, password, userData.name, userData.role, userData.adminSecret);
      await signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const user = await api.signIn(email, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await api.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    return await api.getProfile();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  if (loading) {
    // Optionally, show a splash/loading screen here
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 