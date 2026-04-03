import { api } from "./api";

export const getTotalSessions = async (params) => {
    const response = await api.get('/sessions', { params });
    return response.data;
}

export const getSessionById = async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
}

export const getClickersInSession = async () => {
    const response = await api.get('/sessions/clickers/total');
    return response.data;
}

export const createSession = async (payload) => {
    const response = await api.post('/sessions', payload);
    return response.data;
}

export const deleteSession = async (id, payload) => {
    const response = await api.delete(`/sessions/${id}`, { data: payload });
    return response.data;
}

export const restoreSession = async (id) => {
    const response = await api.patch(`/sessions/${id}/restore`);
    return response.data;
}

export const updateSession = async (id, payload) => {
    const response = await api.patch(`/sessions/${id}`, payload);
    return response.data;
}

export const pauseSession = async (id) => {
    const response = await api.patch(`/sessions/${id}/pause`);
    return response.data;
}

export const cancelSession = async (id, reason = null) => {
    const response = await api.patch(`/sessions/${id}/cancel`, { reason });
    return response.data;
}

export const archiveSession = async (id) => {
    const response = await api.patch(`/sessions/${id}/archive`);
    return response.data;
}

export const completeSession = async (id, payload) => {
    const response = await api.patch(`/sessions/${id}/complete`, payload);
    return response.data;
}