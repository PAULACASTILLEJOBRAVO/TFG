import { Badge } from "@/components/ui/badge";

const QuizDifficultyChip = ({ difficulty }) => {
    if(difficulty === 'hard') {
        return (
            <Badge variant="destructive">
                Difícil
            </Badge>
        );
    }

    if(difficulty === 'medium') {
        return (
            <Badge variant="secondary">
                Medio
            </Badge>
        );
    }

    if(difficulty === 'easy') {
        return (
            <Badge className="bg-green-500 hover:bg-green-500">
                Fácil
            </Badge>
        );
    }

    return(
        <Badge variant="outline">
            Sin dificultad
        </Badge>
    );
}

export default QuizDifficultyChip;