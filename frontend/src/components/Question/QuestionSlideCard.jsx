import { Card, CardContent } from "../ui/card";
import DeleteButton from "../Common/ActionButtons/DeleteButton";

const QuestionSlideCard = ({ index, onSelect, isSelected, onDelete }) => {

    return (
        <Card  onClick={onSelect} className={
            `relative group cursor-pointer transition-colors 
            ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`
        }>
            <div className="
                absolute top-2 right-2
                opacity-0 group-hover:opacity-100
                transition
                z-10
            ">
                <DeleteButton size="xs" onClick={(e) => { e.stopPropagation(); onDelete(index); }} />
            </div>
            {/** Number of question */}
            <CardContent className="flex items-center justify-center p-8 font-bold">
                {index + 1 }
            </CardContent>
        </Card>
    );
}

export default QuestionSlideCard;