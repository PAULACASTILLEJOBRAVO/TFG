const addOptionLetters = (questions = []) => {
    return questions.map((question) => ({
        ...question,
        options: (question.options || []).map((option, index) => ({
            ...option,
            letter: String.fromCharCode(65 + index)
        }))
    }));
};

module.exports = {
    addOptionLetters
}