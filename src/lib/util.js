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

let calcVote = function(up,down) {
    var upPadded = up + 3;
    var downPadded = down + 3;
    var totalPadded = Math.max(up + down, 3);

    var rating =  -Math.log((1 / ((((upPadded - downPadded) / (upPadded + downPadded)) + 1) / 2)) - 1) / Math.log(Math.E);

    rating = Math.min(rating,10);
    rating = Math.max(rating,-10);

    rating = (rating + 10) / 2;

    return rating * Math.log(totalPadded);
}

export {
    checkLength,
    checkRegex,
    calcVote
};