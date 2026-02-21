import axios from 'axios';

const api = axios.create({
  // Tani waa qaybta ugu muhiimsan
  baseURL: window.location.origin.includes('localhost') 
    ? 'http://localhost:5006/api' 
    : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;