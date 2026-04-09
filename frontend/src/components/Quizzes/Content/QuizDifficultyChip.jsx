import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const QuizDifficultyChip = ({ difficulty }) => {
    const { t } = useTranslation();

    if(difficulty === 'hard') {
        return (
            <Badge variant="destructive">
                {t('common.quizzesManagement.detailsCard.difficulty.hard')}
            </Badge>
        );
    }

    if(difficulty === 'medium') {
        return (
            <Badge variant="secondary">
                {t('common.quizzesManagement.detailsCard.difficulty.medium')}
            </Badge>
        );
    }

    if(difficulty === 'easy') {
        return (
            <Badge className="bg-green-500 hover:bg-green-500">
                {t('common.quizzesManagement.detailsCard.difficulty.easy')}
            </Badge>
        );
    }

    return(
        <Badge variant="outline">
            {t('common.quizzesManagement.detailsCard.difficulty.unknown')}
        </Badge>
    );
}

export default QuizDifficultyChip;