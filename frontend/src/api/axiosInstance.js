import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = configuredApiUrl
    ? `${configuredApiUrl.replace(/\/+$/, "")}/api`
    : import.meta.env.DEV
        ? "http://localhost:5000/api"
        : null;

const axiosInstance = axios.create({
    baseURL: apiBaseUrl || undefined
});

axiosInstance.interceptors.request.use((config) => {
    if (!apiBaseUrl) {
        return Promise.reject(
            new Error("VITE_API_URL must be configured for production.")
        );
    }

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;