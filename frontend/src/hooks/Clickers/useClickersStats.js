import { useState, useEffect } from "react";
import { 
    getTotalClickersStats,
    getActiveClickersStats,
    getInUseClickersStats,
    getAvailableClickersStats,
    getInactiveClickersStats
} from "../../services/clicker.service";

export const useClickersStats = () => {
    const [clickersStats, setClickersStats] = useState({
        total: 0,
        active: 0,
        inUse: 0,
        available: 0,
        inactive: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchClickers = async () => {
            setLoading(true);
            setError(null);
            setMessage("");
            setClickersStats({
                total: 0,
                active: 0,
                inUse: 0,
                available: 0,
                inactive: 0
            });

            try{
                const [
                    totalClickersStats,
                    activeClickersStats,
                    inUseClickersStats,
                    availableClickersStats,
                    inactiveClickersStats
                ] = await Promise.all([
                    getTotalClickersStats(),
                    getActiveClickersStats(),
                    getInUseClickersStats(),
                    getAvailableClickersStats(),
                    getInactiveClickersStats()
                ]);

                setClickersStats({
                    total: totalClickersStats.data || 0,
                    active: activeClickersStats.data || 0,
                    inUse: inUseClickersStats.data || 0,
                    available: availableClickersStats.data || 0,
                    inactive: inactiveClickersStats.data || 0
                });

                const firstError =
                    totalClickersStats.error ||
                    activeClickersStats.error ||
                    inUseClickersStats.error ||
                    availableClickersStats.error ||
                    inactiveClickersStats.error;
                
                const firstMessage =
                    totalClickersStats.message ||
                    activeClickersStats.message ||
                    inUseClickersStats.message ||
                    availableClickersStats.message ||
                    inactiveClickersStats.message ||
                    "";

                if (firstError) {
                    setError(firstError);
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setClickersStats({
                    total: 0,
                    active: 0,
                    inUse: 0,
                    available: 0,
                    inactive: 0
                });
            }finally{
                setLoading(false);
            }
        }

        fetchClickers();
    }, []);

    return { clickersStats, loading, error };
};