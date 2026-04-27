import { api } from "./api";

export const createResponse = async (payload) => {
    const response = await api.post('/responses', payload);
    return response.data;
}