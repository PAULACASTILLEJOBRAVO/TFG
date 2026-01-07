import { useState, useEffect } from "react";
import { getActiveCoursesStatsForTeacher } from "../../services/course.service";
import { useAuth } from "@/auth/AuthContext";

export const useTeacherActiveCourses = () => {
    const {user} = useAuth();

    const [activeCoursesForTeacher, setActiveCoursesForTeacher] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if(!user) return;

        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            setMessage("");
            setActiveCoursesForTeacher(0);

            try{
                const data = await getActiveCoursesStatsForTeacher(); 

                if(data.error){
                    setError(data.error);
                    setMessage(data.message || "");
                    setActiveCoursesForTeacher([]);
                } else {
                    setActiveCoursesForTeacher(data.data || 0);
                    setMessage(data.message || "");
                }
            }catch(err) {
                // Axios's error
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                setError(errorMessage);
                setActiveCoursesForTeacher(0);
            }finally{
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    return { activeCoursesForTeacher, loading, error, message };
};