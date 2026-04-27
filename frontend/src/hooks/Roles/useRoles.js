import { 
    useState, 
    useEffect 
} from "react";
import { getTotalRoles } from "../../services/role.service";

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
           
    const fetchRoles = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setRoles([]);

        try{
            const data = await getTotalRoles();

                if(data.error){
                    setError(data.error);
                    setMessage(data.message || "");
                    setRoles([]);
                } else {
                    setRoles(data.data || []);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setRoles([]);
            }finally{
                setLoading(false);
            }
        }

        fetchRoles();
    }, []);

    return { roles, loading, error, message };
};