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

