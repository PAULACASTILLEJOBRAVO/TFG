import { api } from "./api";

export const getTotalDifficulties = async () => {
    const response = await api.get('difficulties');
    return response.data;
}