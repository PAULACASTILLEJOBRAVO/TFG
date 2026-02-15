import { Badge } from "@/components/ui/badge";

const QuizStatusChip = ({ status }) => {
    if(status === 'archived') {
        return (
            <Badge variant="destructive">
                Archivado
            </Badge>
        );
    }

    if(status === 'draft') {
        return (
            <Badge variant="secondary">
                Borrador
            </Badge>
        );
    }

    if(status === 'published') {
        return (
            <Badge className="bg-green-500 hover:bg-green-500">
                Publicado
            </Badge>
        );
    }

    return(
        <Badge variant="outline">
            Sin estado reconocido
        </Badge>
    );
}

export default QuizStatusChip;