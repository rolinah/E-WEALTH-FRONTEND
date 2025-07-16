import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppState, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} role
 * @property {string} [name]
 * @property {string[]} [interests]
 * @property {string} [token]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {boolean} loading
 * @property {(email: string, password: string, userData: { name: string, role: string, adminSecret?: string }) => Promise<void>} signUp
 * @property {(email: string, password: string) => Promise<void>} signIn
 * @property {() => Promise<void>} signOut
 * @property {() => Promise<User>} getProfile
 * @property {boolean} isAuthenticated
 * @property {boolean} isAdmin
 * @property {boolean} needsOnboarding
 */

const AuthContext = createContext/** @type {React.Context<AuthContextType | undefined>} */(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState/** @type {User | null} */(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          let parsedUser = null;
          try {
            parsedUser = JSON.parse(storedUser);
          } catch (e) {
            console.warn('[AuthContext] Invalid user data in AsyncStorage, clearing.');
            await AsyncStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return;
          }
          if (parsedUser?.email && parsedUser?.role) {
            setUser(parsedUser);
            setLoading(false);
            return;
          } else {
            console.warn('[AuthContext] Invalid user data, clearing storage.');
            await AsyncStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return;
          }
        } else {
          setUser(null);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing user:', error);
        await AsyncStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        signOut();
      }
    };

    let subscription;
    try {
      subscription = AppState.addEventListener('change', handleAppStateChange);
    } catch (error) {
      console.warn('[AuthContext] Failed to add AppState listener:', error);
    }

    return () => {
      try {
        subscription?.remove?.() || AppState.removeEventListener?.(' southwest', handleAppStateChange);
      } catch (error) {
        console.warn('[AuthContext] Error removing AppState listener:', error);
      }
    };
  }, []);

  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      await api.signUp(email, password, userData.name, userData.role, userData.adminSecret);
      await signIn(email, password);
    } catch (error) {
      console.error('[AuthContext] Sign-up failed:', error);
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { user } = await api.signIn(email, password);
      if (!user?.email || !user?.role) {
        throw new Error('Invalid user data returned from sign-in');
      }
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('[AuthContext] Sign-in failed:', error);
      throw new Error(error.message || 'Failed to sign in');
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
    } catch (error) {
      console.error('[AuthContext] Sign-out failed:', error);
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const profile = await api.getProfile();
      if (!profile?.email || !profile?.role) {
        throw new Error('Invalid profile data');
      }
      setUser(profile);
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('[AuthContext] Get profile failed:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  };

  const isAuthenticated = !!(user && user.email && user.role);
  const isAdmin = user?.role?.trim().toLowerCase() === 'admin';
  const needsOnboarding = !!(user && Array.isArray(user.interests) && user.interests.length < 2);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signOut,
      getProfile,
      isAuthenticated,
      isAdmin,
      needsOnboarding,
    }),
    [user, loading]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});