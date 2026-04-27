import { api } from "./api";

export const createSession = async (payload) => {
    const response = await api.post('/sessions', payload);
    return response.data;
}


export const updateSession = async (id, payload) => {
    const response = await api.patch(`/sessions/${id}`, payload);
    return response.data;
}

export const completeSession = async (id, payload) => {
    const response = await api.patch(`/sessions/${id}/complete`, payload);
    return response.data;
}