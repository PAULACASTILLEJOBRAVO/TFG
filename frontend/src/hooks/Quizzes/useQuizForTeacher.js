import { useState, useEffect } from "react";
import { getQuizByIdForTeacher } from "../../services/quizzes.service";

export const useQuizForTeacher = (id) => {
    const [quizForTeacher, setQuizForTeacher] = useState(null);
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
                const data = await getQuizByIdForTeacher(id);
                
                if(data.error){
                    // Backend return error (400, 404, 500, etc)
                    setError(data.error);
                    setMessage(data.message || "");
                    setQuizForTeacher(null);
                }else{
                    // Backend return success (200, 201, 204, etc)
                    setQuizForTeacher(data.data || null);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
                setError(errorMessage);
                setQuizForTeacher(null);
            }finally{
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [id]);

    return { quizForTeacher, loading, error, message };
};