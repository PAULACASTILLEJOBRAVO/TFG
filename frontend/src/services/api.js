import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_APIURI,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptors
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const requestUrl = error.config?.url;

        const isAuthRequest =
            requestUrl?.includes("/auth/login") ||
            requestUrl?.includes("/auth/register");

        if(status === 401 && !isAuthRequest){
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);
