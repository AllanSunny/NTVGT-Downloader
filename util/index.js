const timeFormat = require("hh-mm-ss");
const fs = require("fs");
const processLookup = require("ps-node");

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
 * @param array The list to parse.
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
 * Take a timestamp meant for the "hh:mm:ss" format and add leading
 * zeros to any time value (hrs, mins, secs) less than 10.
 * @param time The timestamp to parse, in a string.
 * @returns {string} The timestamp in "hh:mm:ss" format.
 */
function addLeadingZerosTime(time) {
    let values = time.split(":");
    let result = "";

    for (let i = 0; i < values.length; i++) {
        let finalOne = (i === values.length - 1);
        let num = parseInt(values[i]);

        if (num < 10) {
            result += `0${num}`;
        } else {
            result += `${num}`;
        }

        if (!finalOne) {
            result += ":";
        }
    }

    return result;
}

/**
 * Check if a string only contains the digits 0-9.
 * @param string The string to check.
 * @returns {boolean} True if the string is all numbers, false otherwise.
 */
function isNumber(string) {
    return /^\d+$/.test(string);
}

/**
 * Retrieve a Game, Category, or Song from an array.
 * @param name The name or ID number of the object to retrieve.
 * @param array The array the object is stored in.
 * @returns {object} The Game, Category, or Song being looked for,
 *          or undefined if it could not be found.
 */
function getFromArray(name, array) {
    if (isNumber(name)) {
        for (let i = 0; i < array.length; i++) {
            let checking = array[i];

            if (checking.getID() === parseInt(name)) {
                return checking;
            }
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            let checking = array[i];

            if (checking.getName() === name) {
                return checking;
            }
        }
    }
    //If it gets to this point, obj with name not found
}

/**
 * Remove a Game, Category, or Song from an array.
 * @param name The name or ID number of the object to remove.
 * @param array The array the object is stored in.
 * @returns {array} A copy of the original array, with the object of
 *      <name> removed, or no changes made if it was not found.
 */
function removeFromArray(name, array) {
    let toRemoveIndex = -1;
    let removed;

    if (isNumber(name)) {
        for (let i = 0; i < array.length; i++) {
            let checking = array[i];

            if (checking.getID() === parseInt(name)) {
                toRemoveIndex = i;
                removed = checking;
            }
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            let checking = array[i];

            if (checking.getName() === name) {
                toRemoveIndex = i;
                removed = checking;
            }
        }
    }

    if (toRemoveIndex > -1) {
        array.splice(toRemoveIndex, 1);
        removeFileOrDirectory(removed.getFilePath());
        console.log(`Removed ${removed.toString()}.`);
    } else {
        console.error(name + " not found to remove!");
    }

    return array;
}

/**
 * Check if a file or directory already exists.
 * @param path The path to the file to check.
 * @returns {Promise<boolean>} True if the file exists for access,
 * false otherwise.
 */
function checkFileOrDirExistence(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, (error) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Create a directory at a specified path, only if it doesn't exist already.
 * @param path The path to create the directory at.
 */
function createDirectory(path) {
    checkFileOrDirExistence(path)
        .then((exists) => {
            if (!exists) {
                fs.promises.mkdir(path, {recursive: true})
                    .catch((error) => {
                        console.error(`Failed to create directory ${path}.`);
                        if (error) {
                            console.error(error);
                        }
                    });
            }
        });
}

/**
 * Remove a file or a directory, only if it exists already.
 * @param path The path to the file or directory.
 */
function removeFileOrDirectory(path) {
    checkFileOrDirExistence(path)
        .then((exists) => {
            if (exists) {
                fs.lstat(path, ((err, stats) => {
                    if (stats.isFile()) {
                        fs.promises.unlink(path)
                            .catch((error) => {
                                console.error(`Failed to remove file ${path}.`);
                                if (error) {
                                    console.error(error);
                                }
                            });
                    } else { //Is directory
                        fs.promises.rmdir(path, {recursive: true})
                            .catch((error) => {
                                console.error(`Failed to remove directory ${path}.`);
                                if (error) {
                                    console.error(error);
                                }
                            });
                    }
                }));
            }
        });
}

/**
 * Kill all running processes with a specific name.
 * @param name The name of the process to find.
 */
function killAllProcesses(name) {
    return new Promise((resolve, reject) => {
        processLookup.lookup({command: name}, (error, resultList) => {
            if (error) {
                reject(`Failed to find process ${name}.`);
            }

            for (let process of resultList) {
                if (process) {
                    processLookup.kill(process.pid, 'SIGKILL', (error) => {
                        if (error) {
                            console.log(`Process ID ${process.pid} was not found.`);
                        } else {
                            console.log(`Process ID ${process.pid} was stopped.`);
                        }
                    });
                }
            }

            resolve();
        });
    });
}

/**
 * Exit the function gracefully by saving running data before termination.
 * @param code The code to terminate with. (0 is normal, 1 is error)
 */
function gracefulExit(code) {
    //TODO: Save data

    console.log("Gracefully dying and crying");
    process.exit(code);
}


module.exports = {
    titleCase,
    listToString,
    isNumber,
    addLeadingZerosTime,
    getFromArray,
    removeFromArray,
    checkFileOrDirExistence,
    createDirectory,
    calculateDuration,
    killAllProcesses,
    gracefulExit,
};