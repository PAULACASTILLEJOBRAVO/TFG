import { useState, useEffect } from "react";
import { useCourseActions } from "../../hooks/Courses/useCourseActions";
import { useCourses } from "../../hooks/Courses/useCourses";

const CourseEditForm = ({ courseId, onSuccess }) => {
    const { patch, loading, error, message } = useCourseActions();
    const { courses } = useCourses();
    const course = courses.find(c => c._id === courseId);

    const [title, setTitle] = useState(course?.title || "");

    useEffect(() => {
        setTitle(course?.title || "");
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await patch(courseId, {title});
            onSuccess?.();
        }catch {}
    }

    return(
        <div>
            {message && <p>{message}</p>}
            <form>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>Guardar cambios</button>
                {error && <p>Error: {error}</p>}
            </form>
        </div>
    );
};

export default CourseEditForm;