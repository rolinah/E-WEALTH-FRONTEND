import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        // Try to load user from AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          let parsedUser = null;
          try {
            parsedUser = JSON.parse(storedUser);
          } catch (e) {
            // Invalid JSON, clear storage
            await AsyncStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return;
          }
          // TODO: Add token/session validation here if using JWT or session expiry
          if (parsedUser && parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
            console.log('[AuthContext] Loaded user from storage:', parsedUser);
          } else {
            // Invalid user object, clear storage
            await AsyncStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        setUser(null);
        // Optionally clear AsyncStorage on error
        await AsyncStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    console.log('[AuthContext] user:', user, 'loading:', loading, 'isAuthenticated:', !!user);
    AsyncStorage.getItem('user').then(u => {
      console.log('[AuthContext] user in AsyncStorage:', u);
    });
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
      // TODO: Add token/session validation here if needed
      setUser(user);
      // Save user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('[AuthContext] Signed in user:', user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await api.signOut();
      setUser(null);
      await AsyncStorage.removeItem('user');
      console.log('[AuthContext] Signed out user');
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    return await api.getProfile();
  };

  // Only true if user is a valid object with required fields
  const isAuthenticated = !!(user && user.email && user.role);
  const isAdmin = typeof user?.role === 'string' && user.role.trim().toLowerCase() === 'admin';

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getProfile,
    isAuthenticated,
    isAdmin,
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