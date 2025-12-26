import { api } from "./api";

export const getSessions = async () => {
    const response = await api.get('/sessions');
    return response.data;
}