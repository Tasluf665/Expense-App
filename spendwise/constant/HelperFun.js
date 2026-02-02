export const getErrorMessage = (error) => {
    if (error.includes("duplicate key value violates unique constraint")) {
        return "An account with this email already exists.";
    } else if (error.includes("Password should be at least 6 characters")) {
        return "Password should be at least 6 characters";
    } else if (error.includes("Unable to validate email address")) {
        return "Please enter a valid email address.";
    } else if (error.includes("Invalid login credentials")) {
        return "Email or password is incorrect.";
    } else if (error.includes("Email not confirmed")) {
        return "Please verify your email before logging in.";
    } else {
        return error
    }
};