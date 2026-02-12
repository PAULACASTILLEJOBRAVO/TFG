import { useState, useEffect } from "react";
import { getTotalDifficulties } from "../../services/difficulty.service";

export const useDifficulties = () => {
    const [difficulties, setDifficulties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
           
    const fetchDifficulties = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setDifficulties([]);

        try{
            const data = await getTotalDifficulties();

                if(data.error){
                    setError(data.error);
                    setMessage(data.message || "");
                    setDifficulties([]);
                } else {
                    setDifficulties(data.data || []);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setDifficulties([]);
            }finally{
                setLoading(false);
            }
        }

        fetchDifficulties();
    }, []);

    return { difficulties, loading, error, message };
};