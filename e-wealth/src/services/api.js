// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://10.4.60.116:3000';

export const api = {
  // Authentication
  signUp: async (email, password, name) => {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
    return await res.json();
  },
  signIn: async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    const data = await res.json();
    await AsyncStorage.setItem('jwt', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },
  signOut: async () => {
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  getProfile: async () => {
    const token = await AsyncStorage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch profile');
    return await res.json();
  },
  getTopics: async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        // Return mock data for development
        return [
          {
            id: 1,
            title: 'Business Finance Fundamentals',
            description: 'Learn the basics of business finance and financial management.',
            videoURL: null,
            category: 'Finance'
          },
          {
            id: 2,
            title: 'Startup Management',
            description: 'Essential skills for managing and growing your startup.',
            videoURL: null,
            category: 'Management'
          },
          {
            id: 3,
            title: 'Digital Marketing Strategies',
            description: 'Modern marketing techniques for business growth.',
            videoURL: null,
            category: 'Marketing'
          },
          {
            id: 4,
            title: 'Leadership Skills',
            description: 'Develop your leadership capabilities and team management.',
            videoURL: null,
            category: 'Leadership'
          }
        ];
      }
      const res = await fetch(`${BACKEND_URL}/api/topics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch topics');
      return await res.json();
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Return mock data as fallback
      return [
        {
          id: 1,
          title: 'Business Finance Fundamentals',
          description: 'Learn the basics of business finance and financial management.',
          videoURL: null,
          category: 'Finance'
        },
        {
          id: 2,
          title: 'Startup Management',
          description: 'Essential skills for managing and growing your startup.',
          videoURL: null,
          category: 'Management'
        }
      ];
    }
  },
  getAdminData: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/stats`);
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch admin stats');
      return await res.json();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return { users: 0, topics: 0, posts: 0 };
    }
  },
  getCommunity: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts`);
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch community posts');
      return await res.json();
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }
  },
}; 