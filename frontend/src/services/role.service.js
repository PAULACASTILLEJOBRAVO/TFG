import { api } from "./api";

export const getTotalRoles = async () => {
    const response = await api.get('/roles');
    return response.data;
}