import { useState, useEffect } from "react";
import { getTotalUsersStats } from "../../services/user.service";

export const useUsersStats = () => {
    const [usersStats, setUsersStats] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            setMessage("");
            setUsersStats(0);

            try{
                const data = await getTotalUsersStats();

                if(data.error){
                    setError(data.error);
                    setMessage(data.message || "");
                    setUsersStats(0);
                } else {
                    setUsersStats(data.data || 0);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setUsersStats(0);
            }finally{
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return { usersStats, loading, error, message };
};