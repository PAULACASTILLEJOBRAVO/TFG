import { useState, useEffect } from "react";
import { getCourses } from "../../services/course.service";

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            setMessage("");

            try{
                const data = await getCourses();
                console.log("Datos de getCourses:", data); 

                if(data.error){
                    // Backend return error (400, 404, 500, etc.)
                    setError(data.error);
                    setMessage(data.message || "");
                    setCourses([]);
                } else {
                    // Backend return success (200, 201, 204)
                    setCourses(data.data || []);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                console.log("Errores de getCourses:", err); 
                const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
                setError(errorMessage);
                setCourses([]);
            }finally{
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    return { courses, loading, error, message };
};