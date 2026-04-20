import { useState, useEffect } from "react";
import { getQuizQuestionAnalytics } from "../../services/quizzes.service";

export const useQuizQuestionsAnalytics = (id) => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchQuizQuestionsAnalytics = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setAnalytics([]);

        try{
            const data = await getQuizQuestionAnalytics(id);

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setAnalytics([]);
            } else {
                setAnalytics(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setAnalytics([]);
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchQuizQuestionsAnalytics();
    }, []);

    return { analytics, loading, error, message, refetch: fetchQuizQuestionsAnalytics };
};