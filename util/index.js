const timeFormat = require("hh-mm-ss");

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
 * Calculate the duration between two video timestamps.
 * @param startTime The start time, in "hh:mm:ss" format.
 * @param endTime The end time, in "hh:mm:ss" format.
 * @returns {number} The number of seconds between the times.
 */
function calculateDuration(startTime, endTime) {
    let startTimeSecs = timeFormat.toS(startTime);
    let endTimeSecs = timeFormat.toS(endTime);

    return endTimeSecs - startTimeSecs;
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

/**
 * Retrieve a Category or Song from an array.
 * @param name The name of the object to retrieve.
 * @param array The array the object is stored in.
 * @returns {object} The Category or Song being looked for,
 *          or -1 if it could not be found.
 */
function getFromArray(name, array) {
    for (let i = 0; i < array.length; i++) {
        let checking = array[i];

        if (checking.getName() === name) {
            return checking;
        }
    }

    //If it gets to this point, obj with name not found
    console.log("Category name does not exist!");
    return -1;
}

/**
 * Remove a Category or Song from an array.
 * @param name The name of the object to remove.
 * @param array The array the object is stored in.
 * @returns {array} A copy of the original array, with the object of
 *      <name> removed, or no changes made if it was not found.
 */
function removeFromArray(name, array) {
    let toRemoveIndex = -1;
    let removed = -1;

    for (let i = 0; i < array.length; i++) {
        let checking = array[i];

        if (checking.getName() === name) {
            toRemoveIndex = i;
            removed = checking;
        }
    }

    if (toRemoveIndex > -1) {
        array.splice(toRemoveIndex, 1);
        console.log("Successfully removed " + removed.toString());
    } else {
        console.log(name + " not found to remove!");
    }

    return array;
}


module.exports = {
    titleCase,
    listToString,
    getFromArray,
    removeFromArray,
    calculateDuration,
};