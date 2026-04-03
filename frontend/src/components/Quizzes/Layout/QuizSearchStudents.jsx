import {
    StudentSearch,
    StudentList
} from "@/components/Users/Layout/Students";
import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const QuizSearchStudents = ({ selectedIdStudents, selectedStudents, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full p-2 gap-2">
            <Card className="w-full">
                <CardHeader className="font-bold">
                    <StudentSearch placeholder={t("teacher.quizzesManagement.quizForm.studentList.searchPlaceholder")} selectedIdStudents={selectedIdStudents} onSelect={onToggle} showStatus="forTeacher" />
                </CardHeader>

                <CardContent>
                    <h3 className="font-bold text-center">{t("teacher.quizzesManagement.quizForm.studentList.title")} {selectedStudents.length}</h3>
                    <StudentList selectedStudents={selectedStudents} onToggle={onToggle} />
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizSearchStudents;