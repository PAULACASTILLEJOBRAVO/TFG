import { useState, useEffect } from "react";
import { getUserById } from "../../services/user.service";

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setUser(null);

        try{
            const data = await getUserById();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setUser(null);
            } else {
                setUser(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setUser(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error, message, refetch: fetchUser };
};