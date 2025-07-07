// api.js

const BACKEND_URL = 'http://localhost:3000';

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
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },
  signOut: async () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  getProfile: async () => {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch profile');
    return await res.json();
  },
  getTopics: async () => {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${BACKEND_URL}/api/topics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch topics');
    return await res.json();
  },
  getAdminData: async () => {
    const res = await fetch('http://localhost:3000/admin/stats');
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch admin stats');
    return await res.json();
  },
  getCommunity: async () => {
    const res = await fetch('http://localhost:3000/posts');
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch community posts');
    return await res.json();
  },
}; 