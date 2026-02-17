import { api } from "./api";

export const loginRequest = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
}

export const registerRequest = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
}

export const logoutRequest = async () => {
    await api.post("/auth/logout");
}