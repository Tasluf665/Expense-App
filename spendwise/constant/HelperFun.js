export const getErrorMessage = (error) => {
    if (error.includes("duplicate key value violates unique constraint")) {
        return "An account with this email already exists.";
    } else if (error.includes("Password should be at least 6 characters")) {
        return "Password should be at least 6 characters";
    } else if (error.includes("Unable to validate email address")) {
        return "Please enter a valid email address.";
    } else {
        return error
    }
};