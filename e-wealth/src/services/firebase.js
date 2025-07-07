import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, initializeAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig, getCurrentConfig } from '../config/firebase.config';
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const config = getCurrentConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Platform-specific Auth initialization
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // No persistence on web
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// User profile functions
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      balance: 0,
      streak: 0,
      totalPoints: 0
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    throw error;
  }
};

// Topics functions
export const getTopics = async () => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, orderBy('order'));
    const querySnapshot = await getDocs(q);
    
    const topics = [];
    querySnapshot.forEach((doc) => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    
    return topics;
  } catch (error) {
    throw error;
  }
};

export const getUserTopics = async (userId) => {
  try {
    const userTopicsRef = collection(db, 'userTopics');
    const q = query(userTopicsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const userTopics = [];
    querySnapshot.forEach((doc) => {
      userTopics.push({ id: doc.id, ...doc.data() });
    });
    
    return userTopics;
  } catch (error) {
    throw error;
  }
};

export const updateTopicProgress = async (userId, topicId, progress) => {
  try {
    const userTopicRef = doc(db, 'userTopics', `${userId}_${topicId}`);
    await setDoc(userTopicRef, {
      userId,
      topicId,
      progress,
      lastUpdated: new Date()
    }, { merge: true });
  } catch (error) {
    throw error;
  }
};

// Community functions
export const getCommunityPosts = async () => {
  try {
    const postsRef = collection(db, 'communityPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    return posts;
  } catch (error) {
    throw error;
  }
};

export const createCommunityPost = async (postData) => {
  try {
    const postsRef = collection(db, 'communityPosts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: new Date(),
      likes: 0,
      comments: []
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Admin functions
export const getAdminData = async () => {
  try {
    const adminRef = collection(db, 'adminData');
    const querySnapshot = await getDocs(adminRef);
    
    const adminData = {};
    querySnapshot.forEach((doc) => {
      adminData[doc.id] = doc.data();
    });
    
    return adminData;
  } catch (error) {
    throw error;
  }
};

// File upload functions
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export default {
  auth,
  db,
  storage,
  signUp,
  signIn,
  signOutUser,
  getCurrentUser,
  onAuthStateChange,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getTopics,
  getUserTopics,
  updateTopicProgress,
  getCommunityPosts,
  createCommunityPost,
  getAdminData,
  uploadFile
}; 