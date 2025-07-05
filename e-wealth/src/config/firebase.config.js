// Firebase Configuration
// Replace these values with your actual Firebase project configuration

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

// Development configuration
export const devConfig = {
  enableLogging: __DEV__,
  enableAnalytics: false,
  enableCrashlytics: false
};

// Production configuration
export const prodConfig = {
  enableLogging: false,
  enableAnalytics: true,
  enableCrashlytics: true
};

// Get current configuration based on environment
export const getCurrentConfig = () => {
  return __DEV__ ? devConfig : prodConfig;
}; 