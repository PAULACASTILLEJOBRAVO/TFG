import { useState, useEffect } from "react";
import { getTotalStudentsStats } from "../../services/user.service";

export const useStudentsStats = () => {
    const [studentsStats, setStudentsStats] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchStudentsStats = async () => {
            setLoading(true);
            setError(null);
            setMessage("");
            setStudentsStats(0);

            try{
                const data = await getTotalStudentsStats();

                if(data.error){
                    setError(data.error);
                    setMessage(data.message || "");
                    setStudentsStats([]);
                } else {
                    setStudentsStats(data.data || 0);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setStudentsStats(0);
            }finally{
                setLoading(false);
            }
        }

        fetchStudentsStats();
    }, []);

    return { studentsStats, loading, error, message };
};