import { 
    Card, 
    CardContent 
} from "../ui/card";
import { DeleteButton } from "../Common/ActionButtons";
import { 
    Tooltip, 
    TooltipTrigger, 
    TooltipContent 
} from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";

const QuestionSlideCard = ({ index, questionError, isSelected, onSelect, onDelete }) => {

    const countErrors = (error) => {
        if (!error) return 0;

        let count = 0;

        if (error.text) count++;
        if (error.options) count++;

        if (error.optionErrors?.options) {
            count += Object.keys(error.optionErrors.options).length;
        }

        return count;
    };

    const errorCount = countErrors(questionError);

    return (
        <Card  onClick={onSelect} className={
            `relative group cursor-pointer transition-colors 
            ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`
        }>
            {questionError && (
                <div className="absolute top-2 left-2 z-10">
                    <Tooltip>
                        <TooltipTrigger asChild>  
                           <div className={`
                                relative flex items-center justify-center
                                text-white text-xs font-bold
                                w-8 h-5 rounded-full overflow-hidden
                                bg-red-600 shadow
                                ${errorCount === 1 ? 'animate-pulse' : ''}
                                ${errorCount > 1 ? 'pulse-soft' : ''}
                                `}
                            >

                                {/* Icon */}
                                <span className={`absolute flex items-center justify-center ${errorCount > 1 ? 'swap-a' : ''}`}>
                                    <TriangleAlert className="w-3 h-3" />
                                </span>

                                {/* Number */}
                                {errorCount > 1 && (
                                    <span className={`absolute ${errorCount > 1 ? 'swap-b' : ''}`}>
                                        {errorCount}
                                    </span>
                                )}
                                </div>
                        </TooltipTrigger>

                        <TooltipContent>
                            <div className="text-sm flex flex-col gap-1">
                                {questionError.text && <span>{questionError.text}</span>}
                                {questionError.options && <span>{questionError.options}</span>}

                                {questionError.optionErrors?.options &&
                                    Object.values(questionError.optionErrors.options).map((err, i) => (
                                        <span key={i}>{err}</span>
                                    ))
                                }
                            </div>
                        </TooltipContent>
                    </Tooltip>

                </div>
            )}

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