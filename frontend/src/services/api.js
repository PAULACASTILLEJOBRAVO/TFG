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
        // Attach token from localStorage or sessionStorage if available
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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

        // If we get a 401 Unauthorized response and it's not from an auth request, it likely means the token is invalid or expired
        const isAuthRequest =
            requestUrl?.includes("/auth/login") ||
            requestUrl?.includes("/auth/register");

        // Clear tokens and user info from storage and redirect to login page
        if(status === 401 && !isAuthRequest){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);
