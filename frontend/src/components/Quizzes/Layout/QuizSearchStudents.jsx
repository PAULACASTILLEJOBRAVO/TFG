import StudentSearch from "@/components/Users/Layout/Students/StudentSearch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StudentList from "@/components/Users/Layout/Students/StudentList";

const QuizSearchStudents = ({ selectedIdStudents, selectedStudents, onToggle }) => {

    return (
        <div className="w-full p-2 gap-2">
            <Card className="w-full">
                <CardHeader className="font-bold">
                    <StudentSearch placeholder="Buscar estudiantes..." selectedIdStudents={selectedIdStudents} onSelect={onToggle} />
                </CardHeader>

                <CardContent>
                    <h3 className="font-bold text-center">Estudiantes participantes: {selectedStudents.length}</h3>
                    <StudentList selectedStudents={selectedStudents} onToggle={onToggle} />
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizSearchStudents;