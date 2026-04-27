import { 
    useState, 
    useEffect 
} from "react";
import { 
    getTotalStudentsForTeacher, 
    getTotalStudentsForAdmin 
} from "../../services/user.service";
import { useAuth } from "@/auth/AuthContext";

export const useStudents = () => {
    const { user } = useAuth();

    const [studentsForTeacher, setStudentsForTeacher] = useState([]);
    const [studentsForAdmin, setStudentsForAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
        
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        setMessage("");
        setStudentsForTeacher([]);
        setStudentsForAdmin([]);

        try{
            if(!user) throw new Error("User not authenticated");

            let data = null;

            if(user.role === 'teacher') data = await getTotalStudentsForTeacher();

            if(user.role === 'admin') data = await getTotalStudentsForAdmin();

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                setStudentsForTeacher([]);
                setStudentsForAdmin([]);
            } else {
                if(user.role === 'teacher') {
                    setStudentsForTeacher(data.data || []);
                } else if(user.role === 'admin') {
                    setStudentsForAdmin(data.data || []);
                }
                setMessage(data.message || "");
            }
        }catch(err) {
            // Axios's error
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setStudentsForTeacher([]);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return { studentsForTeacher, studentsForAdmin, loading, error, message, refetch: fetchStudents };
};