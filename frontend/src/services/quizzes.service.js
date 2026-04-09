import { api } from "./api";

export const getQuizzesForTeacher = async () => {
  const response = await api.get(`/quizzes/my-teacher`);
  return response.data;
};

export const getQuizzesForStudent = async () => {
    const response = await api.get(`/quizzes/my-student`);
    return response.data;
}

export const getQuizByIdForTeacher = async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
}

export const getQuizByIdForStudent = async (id) => {
    const response = await api.get(`/quizzes/student/${id}`);
    return response.data;
}

export const createQuiz = async (payload) => {
    const response = await api.post('/quizzes', payload);
    return response.data;
}

export const deleteQuiz = async (id, payload) => {
    const response = await api.delete(`/quizzes/${id}`, {
        data: payload
    });
    return response.data;
}

export const restoreQuiz = async (id) => {
    const response = await api.patch(`/quizzes/restore/${id}`);
    return response.data;
}

export const publishQuiz = async (id) => {
    const response = await api.patch(`/quizzes/publish/${id}`);
    return response.data;
}

export const updateQuiz = async (id, payload) => {
    const response = await api.patch(`/quizzes/${id}`, payload);
    return response.data;
}