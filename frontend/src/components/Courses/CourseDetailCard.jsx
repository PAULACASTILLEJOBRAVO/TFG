import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/Courses/useCourses";
import CourseCreateForm from "./CourseCreateForm";

const CourseDetailCard = () => {
    const { courses, loading, error, message } = useCourses();

    if (loading) return <p>Cargando...</p>
    if(error) return <p>Error: {error.message}</p>

    return (
        <div>
            {message && <p>{message}</p>}
            <ul>
                {courses.map(course => (
                    <li key={course._id}>
                        <Link to={`/courses/${course._id}`}>
                            {course.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <CourseCreateForm/>
        </div>
    )
}

export default CourseDetailCard;