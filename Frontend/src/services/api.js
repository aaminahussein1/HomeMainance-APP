import axios from 'axios';

const api = axios.create({
  // Haddii uu jiro VITE_API_URL (Railway) isticmaal, haddii kale localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5006/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;