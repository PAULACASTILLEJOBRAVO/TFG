import { api } from "./api";

export const getTotalClickers = async () => {
    const response = await api.get('/clickers');
    return response.data;
}

export const getTotalClickersStats = async () => {
    const response = await api.get("/clickers/stats");
    return response.data;
}

export const getActiveClickersStats = async () => {
    const response = await api.get("/clickers/stats/active-clickers");
    return response.data;
}

export const getInactiveClickersStats = async () => {
    const response = await api.get("/clickers/stats/inactive-clickers");
    return response.data;
}

export const getInUseClickersStats = async () => {
    const response = await api.get("/clickers/stats/in-use-clickers");
    return response.data;
}

export const getAvailableClickersStats = async () => {
    const response = await api.get("/clickers/stats/available-clickers");
    return response.data;
}   

export const deleteClicker = async (id) => {
    const response = await api.delete(`/clickers/${id}`);
    return response.data;
}

export const restoreClicker = async (id) => {
    const response = await api.patch(`/clickers/${id}/restore`);
    return response.data;
};

export const updateClicker = async (id, payload) => {
    const response = await api.patch(`/clickers/${id}`, payload);
    return response.data;
}

export const createClicker = async (payload) => {
    const response = await api.post('/clickers', payload);
    return response.data;
}