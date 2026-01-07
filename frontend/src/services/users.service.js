import { api } from "./api";

export const getTotalUsersStats = async () => {
    const response = await api.get("/users/stats");
    return response.data;
}

export const getTotalStudentsStats = async () => {
    const response = await api.get("/users/students/stats");
    return response.data;
}