import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const QuizDifficultyChip = ({ difficulty }) => {
    const { t } = useTranslation();

    if(difficulty === 'hard') {
        return (
            <Badge variant="destructive">
                {t('teacher.quizzesManagement.difficulty.hard')}
            </Badge>
        );
    }

    if(difficulty === 'medium') {
        return (
            <Badge variant="secondary">
                {t('teacher.quizzesManagement.difficulty.medium')}
            </Badge>
        );
    }

    if(difficulty === 'easy') {
        return (
            <Badge className="bg-green-500 hover:bg-green-500">
                {t('teacher.quizzesManagement.difficulty.easy')}
            </Badge>
        );
    }

    return(
        <Badge variant="outline">
            {t('teacher.quizzesManagement.difficulty.unknown')}
        </Badge>
    );
}

export default QuizDifficultyChip;