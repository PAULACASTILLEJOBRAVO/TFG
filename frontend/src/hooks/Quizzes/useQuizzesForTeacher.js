import { useState, useEffect } from "react";
import { getQuizzesForTeacher } from "../../services/quizzes.service";

export const useQuizzesForTeacher = ({ limit = 0 }) => {
    const [quizzesForTeacher, setQuizzesForTeacher] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchQuizzesForTeacher = async ({ limit = 0 }) => {
        setLoading(true);
        setError(null);
        setMessage("");
        setQuizzesForTeacher([]);

        try{
            const data = await getQuizzesForTeacher({ limit });

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setQuizzesForTeacher([]);
            } else {
                setQuizzesForTeacher(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setQuizzesForTeacher([]);
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchQuizzesForTeacher({ limit: 0 });
    }, []);

    return { quizzesForTeacher, loading, error, message, refetchTeacher: fetchQuizzesForTeacher };
};