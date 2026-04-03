import { useState, useEffect } from "react";
import { getTotalResponses } from "../../services/response.service";

export const useResponses = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchResponses = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setResponses([]);

        try{
            const data = await getTotalResponses();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setResponses([]);
            } else {
                setResponses(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setResponses([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchResponses();
    }, []);

    return { responses, loading, error, message, refetch: fetchResponses };
};