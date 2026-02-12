const StudentList = ({ selectedStudents, onToggle }) => {
    return (
        <div className="w-full h-50">
            {selectedStudents.length === 0 ? (
                <div className="h-50 flex items-center justify-center text-sm text-muted-foreground text-center py-4">
                    <p>No hay estudiantes seleccionados.</p>
                </div>
            ) : (
                <ul className="h-50 overflow-y-auto space-y-2 p-2">
                    {selectedStudents.map(student => (
                        <li key={student._id} className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm font-medium">{student.fullname ? student.fullname : student.username}</span>
                            <button onClick={() => onToggle(student)} className="text-red-500 hover:text-red-60 hover:bg-red-100 rounded-md p-1 transition-colors">
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default StudentList;