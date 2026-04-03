import { api } from "./api";

export const getTotalClickers = async () => {
    const response = await api.get('clickers');
    return response.data;
}

export const getTotalClickersStats = async () => {
    const response = await api.get("/clickers/stats/total");
    return response.data;
}

export const deleteClicker = async (id, payload) => {
    const response = await api.delete(`/clickers/${id}`, {
        data: payload
    });
    return response.data;
}

export const restoreClicker = async (id) => {
    const response = await api.patch(`/clickers/restore/${id}`);
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