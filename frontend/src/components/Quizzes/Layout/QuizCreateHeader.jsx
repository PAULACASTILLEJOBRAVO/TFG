import { CardDescription, CardHeader, CardTitle } from "../../ui/card";
import EditInput from "../../Common/EditInput";
import EditTextarea from "../../Common/EditTextarea";

const QuizCreateHeader = ({ newQuiz, onChange }) => {
    return (
        <CardHeader className="p-4">
            <CardTitle>
                <EditInput label="Título" value={newQuiz.title} onChange={e => onChange("title", e.target.value)} />
            </CardTitle>
            <CardDescription className="space-y-4 pt-6">           
                
                <EditTextarea label="Descripción" value={newQuiz.description} onChange={e => onChange("description", e.target.value)} />
            </CardDescription>
        </CardHeader>
    );
}

export default QuizCreateHeader;