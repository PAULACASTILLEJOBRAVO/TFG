export const createDefaultOptions = (type) => {
    if(type === "true-false") {
        return [
            {
                text: "Verdadero",
                isCorrect: false
            },
            {
                text: "Falso",
                isCorrect: false
            }
        ]
    }

    return Array.from({ length: 4 }, () => ({ text: "", isCorrect: false }));
};

export const createNewQuestion = (type = "multiple-choice") => ({
    text: "",
    type,
    options: createDefaultOptions(type),
    timeLimit: null,
    points: null
});

