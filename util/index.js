//const List = require("collections/list");

/**
 * Converts a string to title case.
 * @param string The string to convert.
 * @returns {string} The same string, with each word capitalized.
 */
function titleCase(string) {
    let splitStr = string.toLowerCase().split(' ');

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
 * Parses the elements of a list containing Categories or Songs.
 * @param list The list to parse
 * @returns {string} A comma-separated string with the list of elements.
 */
function listToString(list) {
    let result = "";

    for (let i = 0; i < list.length; i++) {
        let finalOne = (i === list.length - 1);

        result += list.get(i).getName();

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