import { useState, useEffect } from "react";
import { getTotalStudents } from "../../services/user.service";

export const useStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setStudents([]);

        try{
            const data = await getTotalStudents();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setStudents([]);
            } else {
                setStudents(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setStudents([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return { students, loading, error, message, refetch: fetchStudents };
};