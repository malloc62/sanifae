let checkLength = function(string, field, lowerBound, upperBound) {
    if (string.length < lowerBound) {
        if (string.length == 0) {
            return { success: `${field} cannot be blank.` }
        }
        return { success: `${field} is too short (minimum length: ${lowerBound} characters).` }
    }

    if (string.length > upperBound) {
        return { success: `${field} is too long (maximum length: ${upperBound} characters).` }
    }

    return false;
}

let checkRegex = function(string, field, regex) {
    if (string.search(regex) != -1) {
        return { success: `${field} contains illegal characters.` }
    }
    return false;
}

export {
    checkLength,
    checkRegex
};