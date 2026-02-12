import { CardDescription, CardHeader, CardTitle } from "../../ui/card";
import EditInput from "../../Common/EditInput";
import EditTextarea from "../../Common/EditTextarea";
import QuizDifficultySelector from "@/components/Quizzes/QuizDifficultySelector";

const QuizCreateHeader = ({ newQuiz, difficulties, onChange }) => {

    return (
        <CardHeader className="p-4">
            <CardTitle>
                <EditInput label="Título" value={newQuiz.title} onChange={e => onChange("title", e.target.value)} />
            </CardTitle>
            <CardDescription className="space-y-4 pt-6">           
                
                <EditTextarea label="Descripción" value={newQuiz.description} onChange={e => onChange("description", e.target.value)} />

                <QuizDifficultySelector
                    value={newQuiz?.difficulty ? newQuiz.difficulty : difficulties[0]?.value}
                    onChange={value => onChange("difficulty", value)}
                    difficulties={difficulties}
                />
            </CardDescription>
        </CardHeader>
    );
}

export default QuizCreateHeader;