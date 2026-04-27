import { 
    useState, 
    useEffect 
} from "react";
import { getTotalUsers } from "../../services/user.service";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setUsers([]);

        try{
            const data = await getTotalUsers();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setUsers([]);
            } else {
                setUsers(data.data || []);
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setUsers([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, message, refetch: fetchUsers };
};