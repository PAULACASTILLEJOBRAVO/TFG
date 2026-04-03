import { useState, useEffect } from "react";
import { getQuizzesForTeacher } from "../../services/quizzes.service";

export const useQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchQuizzes = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setQuizzes([]);

        try{
            const data = await getQuizzesForTeacher();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setQuizzes([]);
            } else {
                setQuizzes(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setQuizzes([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuizzes();
    }, []);

    return { quizzes, loading, error, message, refetch: fetchQuizzes };
};