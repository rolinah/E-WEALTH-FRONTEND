// api.js
// Axios config for backend calls placeholder

// If you haven't already, run: npm install axios
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const api = {
  getUserProfile: () => axios.get(`${BASE_URL}/user/profile`).then(res => res.data),
  getTopics: () => axios.get(`${BASE_URL}/topics`).then(res => res.data),
  getDashboard: () => axios.get(`${BASE_URL}/dashboard`).then(res => res.data),
  getCommunity: () => axios.get(`${BASE_URL}/community`).then(res => res.data),
  getAdminData: () => axios.get(`${BASE_URL}/admin`).then(res => res.data),
}; 