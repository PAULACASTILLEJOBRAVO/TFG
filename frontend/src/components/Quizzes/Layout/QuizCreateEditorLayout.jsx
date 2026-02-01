const QuizCreateEditorLayout = ({ children }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 p-2">
            {children}
        </div>
    )
};

export default QuizCreateEditorLayout;