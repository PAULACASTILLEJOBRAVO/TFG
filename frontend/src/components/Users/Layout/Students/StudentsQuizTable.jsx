import { useTranslation } from "react-i18next";
import { 
    Table, 
    TableBody, 
    TableHead, 
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { StudentsQuizRow } from ".";
import { TablePaginationFooter } from "@/components/Common";

const StudentsQuizTable = ({ students, currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, onSelect, loading }) => {
    const { t } = useTranslation();

    if (loading) return <Spinner />;

    return (
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>{t("teacher.quizSessions.studentsQuizTable.name")}</TableHead>
                        <TableHead>{t("teacher.quizSessions.studentsQuizTable.attempts")}</TableHead>
                        <TableHead>{t("teacher.quizSessions.studentsQuizTable.accuracy")}</TableHead>
                        <TableHead>{t("teacher.quizSessions.studentsQuizTable.avgTime")}</TableHead>
                        <TableHead>{t("teacher.quizSessions.studentsQuizTable.lastSession")}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {students.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                {t("teacher.quizSessions.studentsQuizTable.noStudents")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((student, index) => (
                           <StudentsQuizRow
                                key={student._id}
                                index={index}
                                student={student}
                                onSelect={onSelect}
                            />
                        ))
                    )}
                </TableBody>
            </Table>

            <TablePaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </div>
    );
};

export default StudentsQuizTable;