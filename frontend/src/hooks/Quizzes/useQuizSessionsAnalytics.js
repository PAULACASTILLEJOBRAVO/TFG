import { 
    useState, 
    useEffect 
} from "react";
import { getQuizSessionAnalytics } from "../../services/quizzes.service";

export const useQuizSessionsAnalytics = (id) => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchQuizSessionsAnalytics = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setAnalytics([]);

        try{
            const data = await getQuizSessionAnalytics(id);

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
        fetchQuizSessionsAnalytics();
    }, []);

    return { analytics, loading, error, message, refetch: fetchQuizSessionsAnalytics };
};