import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const axiosInstance = axios.create({
    baseURL: `${backendURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
