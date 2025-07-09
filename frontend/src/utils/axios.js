import axios from 'axios';
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const axiosInstance = axios.create({
    baseURL: `${backendURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
})
