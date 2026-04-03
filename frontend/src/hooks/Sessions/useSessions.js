import { useState, useEffect } from "react";
import { getTotalSessions } from "../../services/sessions.service";

export const useSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setSessions([]);

        try{
            const data = await getTotalSessions();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setSessions([]);
            } else {
                setSessions(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setSessions([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSessions();
    }, []);

    return { sessions, loading, error, message, refetch: fetchSessions };
};