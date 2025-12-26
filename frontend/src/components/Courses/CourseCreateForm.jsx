import { useCourseActions } from "../../hooks/Courses/useCourseActions";

const CourseCreateForm = () => {
    const { create, loading, error, message } = useCourseActions();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {title: "Nuevo curso", teacherId: "69403ec7b7b77ea3196c5a07"};

        try {
            await create(payload);
            alert("Curso creado");
        }catch{}
    };

    return (
        <div>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <button disabled={loading}>
                    {loading ? "Guardando..." : "Crear"}
                </button>        
            </form>
            {error && <p>Error al guardar: {error}</p>}            
        </div>

    );
};

export default CourseCreateForm;