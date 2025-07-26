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

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${backendURL}/api/v1/users/refresh-token`, {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;
        localStorage.setItem("token", newToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // or navigate from context
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

