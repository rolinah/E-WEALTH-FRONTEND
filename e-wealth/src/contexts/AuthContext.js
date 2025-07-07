import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(api.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(api.getCurrentUser());
  }, []);

  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      await api.signUp(email, password, userData.name);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 