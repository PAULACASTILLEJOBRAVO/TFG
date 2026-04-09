import { useState, useEffect } from "react";
import { getQuizByIdForStudent } from "../../services/quizzes.service";

export const useQuizForStudent = (id) => {
    const [quizForStudent, setQuizForStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            setMessage("");

            try{
                const data = await getQuizByIdForStudent(id);
                
                if(data.error){
                    // Backend return error (400, 404, 500, etc)
                    setError(data.error);
                    setMessage(data.message || "");
                    setQuizForStudent(null);
                }else{
                    // Backend return success (200, 201, 204, etc)
                    setQuizForStudent(data.data || null);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
                setError(errorMessage);
                setQuizForStudent(null);
            }finally{
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [id]);

    return { quizForStudent, loading, error, message };
};