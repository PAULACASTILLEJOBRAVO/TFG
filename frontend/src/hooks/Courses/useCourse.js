import { useState, useEffect } from "react";
import { getCourseById } from "../../services/course.service";

export const useCourse = (id) => {
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchCourse = async () => {
            setLoading(true);
            setError(null);
            setMessage("");

            try{
                const data = await getCourseById(id);
                console.log("Datos de getCourseById:", data); 
                
                if(data.error){
                    // Backend return error (400, 404, 500, etc)
                    setError(data.error);
                    setMessage(data.message || "");
                    setCourse([]);
                }else{
                    // Backend return success (200, 201, 204, etc)
                    setCourse(data.data || []);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                console.log("Errores de getCourseById:", err); 
                const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
                setError(errorMessage);
                setCourse([]);
            }finally{
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    return { course, loading, error, message };
};