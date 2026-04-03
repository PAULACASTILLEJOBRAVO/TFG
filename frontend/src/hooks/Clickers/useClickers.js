import { useState, useEffect } from "react";
import { getTotalClickers } from "../../services/clicker.service";

export const useClickers = () => {
    const [clickers, setClickers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchClickers = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setClickers([]);

        try{
            const data = await getTotalClickers();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setClickers([]);
            } else {
                setClickers(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setClickers([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClickers();
    }, []);

    return { clickers, loading, error, message, refetch: fetchClickers };
};