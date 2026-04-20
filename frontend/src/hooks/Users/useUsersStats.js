import { useState, useEffect } from "react";
import { 
    getTotalUsersStats,
    getActiveUsersStats,
    getConnectedUsersStats,
    getArchivedUsersStats
} from "../../services/user.service";

export const useUsersStats = () => {
    const [Userstats, setUserStats] = useState({
        total: 0,
        active: 0,
        connected: 0,
        archived: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            setMessage("");

            try {
                const [
                    totalUserStats,
                    activeUserStats,
                    connectedUserStats,
                    archivedUserStats
                ] = await Promise.all([
                    getTotalUsersStats(),
                    getActiveUsersStats(),
                    getConnectedUsersStats(),
                    getArchivedUsersStats()
                ]);

                setUserStats({
                    total: totalUserStats.data || 0,
                    active: activeUserStats.data || 0,
                    connected: connectedUserStats.data || 0,
                    archived: archivedUserStats.data || 0
                });

                const firstError =
                    totalUserStats.error ||
                    activeUserStats.error ||
                    connectedUserStats.error ||
                    archivedUserStats.error;

                if (firstError) {
                    setError(firstError);
                }

            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    "Unknown error";

                setError(errorMessage);

                setUserStats({
                    total: 0,
                    active: 0,
                    connected: 0,
                    archived: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { Userstats, loading, error };
};