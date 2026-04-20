import { 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { formatTime } from "@/utils/sessions";

const StudentsQuizRow = ({index, student, onSelect}) => {
    const { t } = useTranslation();

    return(
        <TableRow onClick={() => onSelect(student)} className="cursor-pointer hover:bg-muted">
            <TableCell className="font-bold">{index + 1}</TableCell>
            <TableCell className="font-medium capitalize">{student.name}</TableCell>
            <TableCell>{student.sessionsCount}</TableCell>
            <TableCell className={
                student.accuracy >= 80 ? "text-green-600" :
                student.accuracy >= 50 ? "text-yellow-600" :
                "text-red-600"
            }>
                {student.accuracy}%
            </TableCell>
            <TableCell>{formatTime(student.avgTime)}</TableCell>
            <TableCell>{student.lastSession 
                ? new Date(student.lastSession).toLocaleDateString()
                : "-"
            }</TableCell>
        </TableRow>
    );
}

export default StudentsQuizRow;