export const validatePassword = (password, confirmPassword) => {
    if(!password || !confirmPassword) return "Password and confirm password are required";
    // if(password.length < 6) return "Password must be at least 6 characters long";
    if(password !== confirmPassword) return "Passwords do not match";
    return null;
}