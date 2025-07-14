// api.js
import storage from './storage';

// Use environment variable or fallback to localhost
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const api = {
  // Authentication
  signUp: async (email, password, name, role, adminSecret) => {
    const body = { email, password, name };
    if (role) body.role = role;
    if (adminSecret) body.adminSecret = adminSecret;
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Signup failed');
    }
    return await res.json();
  },
  signIn: async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }
    const data = await res.json();
    await storage.setItem('jwt', data.token);
    await storage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },
  signOut: async () => {
    await storage.removeItem('jwt');
    await storage.removeItem('user');
  },
  getCurrentUser: async () => {
    try {
      const user = await storage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  getProfile: async () => {
    const token = await storage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch profile');
    }
    return await res.json();
  },
  getTopics: async () => {
    try {
      const token = await storage.getItem('jwt');
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch topics');
      }
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch admin stats');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return { users: 0, topics: 0, posts: 0 };
    }
  },
  getCommunity: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/posts`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch community posts');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }
  },
  updateProfile: async (profileData) => {
    const token = await storage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    return await res.json();
  },
  getUserBadges: async (userId) => {
    const token = await storage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/badges/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch badges');
    }
    return await res.json();
  },
  getUserProgress: async () => {
    const token = await storage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch profile');
    }
    return await res.json();
  },
}; 