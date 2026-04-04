import axios from "axios";

const API = axios.create({
  baseURL: "https://fornix-medical.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // window.location.href = '/login';


    }
    return Promise.reject(error);
  }
);

export default API;
