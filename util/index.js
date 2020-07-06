

/**
 * Converts a string to title case, where each first letter of a word/phrase
 * (separated by spaces) is capitalized.
 * @param string The string to convert.
 * @returns {string} The converted string.
 */
function titleCase(string) {
    let splitStr = string.split(' ');

    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
}

/**
 * Parses a time in seconds to minutes and seconds.
 * @param time The time in seconds.
 * @returns {string} The time in MM:SS format.
 */
function parseToMMSS(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time - (minutes * 60);

    //Any number less than 10, add a zero to front of it
    function addZeroToSingles(num) {
        return (num < 10 ? '0' : '') + num;
    }

    minutes = addZeroToSingles(minutes);
    seconds = addZeroToSingles(seconds);

    return `${minutes}:${seconds}`;
}

/**
 * Parses the elements of an array containing Categories or Songs.
 * @param array The list to parse
 * @returns {string} A comma-separated string with the list of elements.
 */
function listToString(array) {
    let result = "";

    for (let i = 0; i < array.length; i++) {
        let finalOne = (i === array.length - 1);

        result += array[i].getName();

        if (!finalOne) {
            result += ", ";
        }
    }

    return result;
}


module.exports = {
    titleCase,
    parseToMMSS,
    listToString,
};