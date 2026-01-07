import { api } from "./api";

export const getCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
}

export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
}

export const getActiveCoursesStatsForTeacher = async () => {
    const response = await api.get("/courses/stats/active-courses-for-teacher");
    return response.data;
}


export const createCourse = async (payload) => {
    const response = await api.post('/courses', payload);
    return response.data;
}

export const patchCourse = async (id, payload) => {
    const response = await api.patch(`/courses/${id}`, payload);
    return response.data;
}

export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
}