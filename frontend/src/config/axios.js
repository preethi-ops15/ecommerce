// src/config/axios.js
import axios from 'axios';

// Read API root from env (or default)
const raw = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
const host = raw.endsWith('/api') ? raw : `${raw}/api`;

export const axiosi = axios.create({
  baseURL: host,            // → e.g. http://localhost:8000/api
  withCredentials: true,     // if you need cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from localStorage before each request
axiosi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
