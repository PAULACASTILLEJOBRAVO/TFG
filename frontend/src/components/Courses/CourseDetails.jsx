import { useParams } from "react-router-dom";
import { useCourse } from "../../hooks/Courses/useCourse";
import CourseEditForm from "../Courses/CourseEditForm";

const CourseDetail = () => {
    const { id } = useParams();
    const { course, loading, error, message } = useCourse(id);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar el curso.</p>;
    if (!course) return <p>No existe.</p>;

    return(
        <div>
            {message && <p>{message}</p>}
            <h1>{course.title}</h1>
            <p>Máximo de estudiantes: {course.maxStudents}</p>
            <br/>
            <CourseEditForm courseId={id} onSuccess={() => console.log("Curso actualizado con éxito!")} />
        </div>
    );
}

export default CourseDetail;