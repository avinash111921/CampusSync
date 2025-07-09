import axios from 'axios';
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const axiosInstance = axios.create({
    baseURL: `${backendURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
})


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
