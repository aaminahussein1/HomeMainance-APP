import axios from 'axios';

const api = axios.create({
  // Haddii uu mashruucu Live yahay, wuxuu isticmaalayaa '/api' 
  // Haddii aad kombiyuutarkaaga ku jirto (localhost), wuxuu isticmaalayaa 'http://localhost:5006/api'
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