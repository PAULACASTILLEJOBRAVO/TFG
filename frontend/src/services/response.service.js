import { api } from "./api";

export const getTotalResponses = async () => {
    const response = await api.get('/responses');
    return response.data;
}

export const getResponsesById = async () => {
    const response = await api.get(`/responses/${id}`);
    return response.data;
}

export const getResponsesBySession = async (sessionId) => {
    const response = await api.get(`/responses/session/${sessionId}`);
    return response.data;
}

export const createResponse = async (payload) => {
    const response = await api.post('/responses', payload);
    return response.data;
}

export const updateResponse = async (id, payload) => {
    const response = await api.patch(`/responses/${id}`, payload);
    return response.data;
}

export const deleteResponse = async (id) => {
    const response = await api.delete(`/responses/${id}`);
    return response.data;
}

export const restoreResponse = async (id) => {
    const response = await api.patch(`/responses/restore/${id}`);
    return response.data;
}

