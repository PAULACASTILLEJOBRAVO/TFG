export const validatePassword = (password, confirmPassword) => {
    const errors = {};

    // Check if password is provided and meets length requirements
    if(!password) errors.password = "Password is required";
    else if(password && password.length < 3) errors.password = "Password must be at least 3 characters";
    
    // If confirmPassword is provided, check if it matches the password
    if(confirmPassword !== undefined) {
        // Check if confirm password is provided and matches the password
        if(!confirmPassword) errors.confirmPassword = "Confirm password is required";
        else if(password && confirmPassword && password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}

export const validateUsername = (username) => {
    const errors = {};

    // Check if username is provided
    if(!username || !username.trim()) errors.username = "Username is required";

    // Check if username meets length requirements
    else if(username.length < 3) errors.username = "Username must be at least 3 characters";

    return Object.keys(errors).length > 0 ? errors : null;
}

export const validateEmail = (email) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is provided
    if(!email || !email.trim()) errors.email = "Email is required";

    // Check if email is in valid format
    else if(!emailRegex.test(email)) errors.email = "Invalid email format";

    return Object.keys(errors).length > 0 ? errors : null;
}

export const validateQuiz = (quiz) => {
    const errors = {};

    // Check if title is provided and meets length requirements
    if(!quiz.title || !quiz.title.trim()) errors.title = "Title is required";
    else if(quiz.title.length < 3) errors.title = "Title must be at least 3 characters";

    return Object.keys(errors).length > 0 ? errors : null;
}

export const validateQuestion = (question) => {
    const errors = {};

    if(!question.text || !question.text.trim()) errors.text = "Question text is required";
    
    if(!question.options || question.options.length === 0) {
        errors.options = "At least one option is required";
    } else {
        const correctOptions = question.options.filter(option => option.isCorrect);

        if(correctOptions.length === 0) errors.options = "At least one correct option is required";
        else if(correctOptions.length > 1) errors.options = "Only one correct option is allowed";

        const optionErrors = {};

        question.options.forEach((option, index) => {
            if(!option.text || !option.text.trim()) {
                if(!optionErrors.options) optionErrors.options = {};
                optionErrors.options[index] = "Option text is required";
            }
        });

        if (Object.keys(optionErrors).length > 0) {
            errors.optionErrors = optionErrors;
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}