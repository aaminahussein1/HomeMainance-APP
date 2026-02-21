import axios from 'axios';

const api = axios.create({
  // Koodkani wuxuu si otomaatig ah u gartaa haddii aad joogto Localhost iyo haddii aad Live tahay
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