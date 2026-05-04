import { api } from "./api";

export const getTotalUsers = async () => {
    const response = await api.get('/users');
    return response.data;
}

export const getTotalStudentsForTeacher = async () => {
    const response = await api.get('/users/students-for-teacher');
    return response.data;
}

export const getTotalStudentsForAdmin = async () => {
    const response = await api.get('/users/students-for-admin');
    return response.data;
}

export const getTotalUsersStats = async () => {
    const response = await api.get("/users/stats");
    return response.data;
}

export const getActiveUsersStats = async () => {
    const response = await api.get("/users/stats/active");
    return response.data;
}

export const getConnectedUsersStats = async () => {
    const response = await api.get("/users/stats/connected");
    return response.data;
}

export const getArchivedUsersStats = async () => {
    const response = await api.get("/users/stats/archived");
    return response.data;
}

export const getUserById = async () => {
    const response = await api.get(`/users/me`);
    return response.data;
}

export const archiveUser = async (id) => {
    const response = await api.patch(`/users/${id}/archive`);
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

export const changePasswordUser = async (id, payload) => {
    const response = await api.patch(`/users/${id}/password`, payload);
    return response.data;
}

export const restoreUser = async (id) => {
    const response = await api.patch(`/users/${id}/restore`);
    return response.data;
};

export const updateUser = async (id, payload) => {
    const response = await api.patch(`/users/${id}`, payload);
    return response.data;
}

export const createUser = async (payload) => {
    const response = await api.post('/users', payload);
    return response.data;
}