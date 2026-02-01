import { api } from "./api";

export const createQuiz = async (payload) => {
    const response = await api.post('/quizzes', payload);
    return response.data;
}