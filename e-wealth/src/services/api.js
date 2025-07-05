// api.js
// Firebase-based API service
import firebase from './firebase';

export const api = {
  // Authentication
  signUp: (email, password) => firebase.signUp(email, password),
  signIn: (email, password) => firebase.signIn(email, password),
  signOut: () => firebase.signOutUser(),
  getCurrentUser: () => firebase.getCurrentUser(),
  onAuthStateChange: (callback) => firebase.onAuthStateChange(callback),

  // User Profile
  createUserProfile: (userId, userData) => firebase.createUserProfile(userId, userData),
  getUserProfile: (userId) => firebase.getUserProfile(userId),
  updateUserProfile: (userId, updates) => firebase.updateUserProfile(userId, updates),

  // Topics
  getTopics: () => firebase.getTopics(),
  getUserTopics: (userId) => firebase.getUserTopics(userId),
  updateTopicProgress: (userId, topicId, progress) => firebase.updateTopicProgress(userId, topicId, progress),

  // Community
  getCommunityPosts: () => firebase.getCommunityPosts(),
  createCommunityPost: (postData) => firebase.createCommunityPost(postData),

  // Admin
  getAdminData: () => firebase.getAdminData(),

  // File Upload
  uploadFile: (file, path) => firebase.uploadFile(file, path),

  // Legacy methods for backward compatibility
  getDashboard: async () => {
    const user = firebase.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const [profile, topics] = await Promise.all([
      firebase.getUserProfile(user.uid),
      firebase.getTopics()
    ]);
    
    return {
      profile,
      topics,
      recentActivity: []
    };
  },

  getCommunity: async () => {
    return await firebase.getCommunityPosts();
  }
}; 