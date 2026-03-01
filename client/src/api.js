import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nexora-api.onrender.com/api'; // Replace with your actual Render URL later if different

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
