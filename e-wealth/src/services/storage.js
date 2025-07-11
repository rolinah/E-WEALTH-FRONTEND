// storage.js - Web-compatible storage solution
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Web-compatible storage implementation
class WebStorage {
  constructor() {
    this.isWeb = Platform.OS === 'web';
    this.isServerSide = typeof window === 'undefined';
  }

  async getItem(key) {
    if (this.isServerSide) {
      return null;
    }
    
    if (this.isWeb) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage not available:', error);
        return null;
      }
    } else {
      return await AsyncStorage.getItem(key);
    }
  }

  async setItem(key, value) {
    if (this.isServerSide) {
      return;
    }
    
    if (this.isWeb) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }

  async removeItem(key) {
    if (this.isServerSide) {
      return;
    }
    
    if (this.isWeb) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    } else {
      await AsyncStorage.removeItem(key);
    }
  }

  async clear() {
    if (this.isServerSide) {
      return;
    }
    
    if (this.isWeb) {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    } else {
      await AsyncStorage.clear();
    }
  }
}

// Create a singleton instance
const storage = new WebStorage();

export default storage; 