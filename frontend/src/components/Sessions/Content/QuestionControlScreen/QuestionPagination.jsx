const QuestionPagination = ({ currentIndex, totalQuestions }) => {
    return (
        <div className="flex justify-center gap-2 mb-4">
                {Array.from({length: totalQuestions}).map((_, index) => (
                   <div
                        key={index}
                        className={`
                            w-8 h-8 flex items-center justify-center 
                            rounded-full font-semibold text-sm
                            ${index === currentIndex ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-500'}
                        `}
                    >
                        {index + 1}
                    </div>
                ))}
        </div>
    );
}

export default QuestionPagination;