import { useState, useEffect } from "react";
import { getQuizzesForStudent } from "../../services/quizzes.service";

export const useQuizzesForStudent = () => {
    const [quizzesForStudent, setQuizzesForStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchQuizzesForStudent = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setQuizzesForStudent([]);

        try{
            const data = await getQuizzesForStudent();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setQuizzesForStudent([]);
            } else {
                setQuizzesForStudent(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setQuizzesForStudent([]);
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchQuizzesForStudent();
    }, []);

    return { quizzesForStudent, loading, error, message, refetchStudent: fetchQuizzesForStudent };
};