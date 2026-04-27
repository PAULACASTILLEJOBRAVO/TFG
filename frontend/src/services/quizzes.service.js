import { api } from "./api";

export const getQuizzesForTeacher = async ({ limit = 0 }) => {
  const response = await api.get(`/quizzes/my-teacher?limit=${limit}`);
  return response.data;
};

export const getQuizzesForStudent = async ({ limit = 0 }) => {
    const response = await api.get(`/quizzes/my-student?limit=${limit}`);
    return response.data;
}

export const getQuizById = async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
}

export const getQuizByIdForStudent = async (id, studentId) => {
    const url = studentId
        ? `/quizzes/${id}/student?studentId=${studentId}`
        : `/quizzes/${id}/student`;

    const response = await api.get(url);
    return response.data;
}

export const getQuizSessionsForTeacher = async (id) => {
    const response = await api.get(`/quizzes/${id}/sessions`);
    return response.data;
}

export const getQuizQuestionAnalytics = async (id) => {
    const response = await api.get(`/quizzes/${id}/questions-analytics`);
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
    const response = await api.patch(`/quizzes/${id}/restore`);
    return response.data;
}

export const publishQuiz = async (id) => {
    const response = await api.patch(`/quizzes/${id}/publish`);
    return response.data;
}

export const updateQuiz = async (id, payload) => {
    const response = await api.patch(`/quizzes/${id}`, payload);
    return response.data;
}