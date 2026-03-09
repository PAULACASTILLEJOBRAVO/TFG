import { 
    CardDescription, 
    CardHeader,
    CardTitle 
} from "../../ui/card";
import { 
    EditInput, 
    EditTextarea
} from "../../Common";
import { QuizDifficultySelector } from "@/components/Quizzes/Content";
import { useTranslation } from "react-i18next";

const QuizCreateHeader = ({ newQuiz, quizError, touched, submitted, difficulties, onChange, onBlur }) => {
    const { t } = useTranslation();

    return (
        <CardHeader className="p-4">
            <CardTitle>
                <EditInput 
                    label={t("teacher.quizzesManagement.quizForm.title")} 
                    value={newQuiz.title ?? ""} 
                    onChange={e => onChange("title", e.target.value)} 
                    isRequired={true}
                    error={(submitted || touched?.quiz?.title) && quizError?.title}
                    errorMessage={quizError?.title}
                    onBlur={() => onBlur("quiz", "title")}
                />
            </CardTitle>
            <CardDescription className="space-y-4 pt-6">           
                
                <EditTextarea 
                    label={t("teacher.quizzesManagement.quizForm.description")} 
                    value={newQuiz.description ?? ""}
                    onChange={e => onChange("description", e.target.value)} 
                />

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