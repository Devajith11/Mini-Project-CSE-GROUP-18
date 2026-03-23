import axios from 'axios';

export const BASE_URL = (import.meta.env.VITE_API_URL || 'https://mini-project-cse-group-18.onrender.com').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${BASE_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;