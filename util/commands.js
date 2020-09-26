const util = require ("./index");
const {DownloadJobQueue} = require("./songdownloader");

/**
 * Retrieve an object from the next layer down in the data tree.
 * @param object The GameManager, Game, or Category to use as the reference.
 * @param {string[]} args Arguments in this order: [name (title) or ID number]
 * @returns {Promise<object>} Resolves with the desired object if found.
 */
function get(object, args) {
    return new Promise((resolve, reject) => {
        let result;

        if (typeof object.getData === "function") {
            result = object.getData(args[0]);
        }

        if (result) {
            resolve(result);
        } else {
            reject("Could not find that data.");
        }
    });
}

/**
 * Retrieve the object from the previous layer in the data tree.
 * @param object The Game, Category, or Song to use as the reference.
 * @returns {Promise<object>} Resolves with the desired object if found.
 */
function previous(object) {
    return new Promise((resolve, reject) => {
        let result;

        if (typeof object.getPrevious === "function") {
            result = object.getPrevious();
        }

        if (result) {
            resolve(result);
        } else {
            reject("Could not find that data.");
        }
    });
}

/**
 * Add a new data object for the next layer of the data tree.
 * @param object The GameManager, Game, or Category to create and store
 *      the new object in.
 * @param {string[]} args Arguments, handled by the individual objects
 *      for this command.
 * @returns {Promise} Resolves upon successful addition, rejects if
 *      the new data already exists.
 */
function add(object, args) {
    return new Promise((resolve, reject) => {
        if (typeof object.addData === "function") {
            object.addData(args)
                .then(() => {
                    resolve(); //Reference object does not change
                })
                .catch((reason) => {
                    reject(reason);
                });
        } else {
            reject("Cannot add data here.");
        }
    });
}

/**
 * Remove an object from the next layer of the data tree.
 * @param object The GameManager, Game, or Category that the object
 *      is stored in.
 * @param {string[]} args Arguments in this order: [name (title) or ID number]
 * @returns {Promise} Resolves upon successful removal, rejects if the
 *      object does not exist.
 */
function remove(object, args) {
    return new Promise((resolve, reject) => {
        let result;

        if (typeof object.removeData === "function") {
            result = object.removeData(args[0]);
        }

        if (result) {
            resolve(); //Reference object does not change
        } else {
            reject("Could not find that data.");
        }
    });
}

/**
 * Initiate the download process for all songs. This is a "cancellable task". If no
 * root download directory is provided, the previous one will be used unless it is
 * undefined.
 * @param object The CommandInterpreter starting the task.
 * @param args Arguments in this order:
 *      [root download directory, concurrency limit (optional)]
 * @returns {Promise<GameManager>} Resolves once all downloads are complete/aborted.
 */
function download(object, args) {
    return new Promise(async (resolve, reject) => {
        console.log("Preparing to download songs... [enter 'stop' at any time to abort]");
        let downloadJobQueue = new DownloadJobQueue(object.getGameManager(), args[1]);
        object.setCancellableTask(downloadJobQueue);

        let destination = args[0];
        let allowDownload = true; //Flag to control code flow

        if (destination === undefined) { //No destination provided
            let previousDest = object.getPreviousDestination();
            if (previousDest !== undefined) {
                destination = previousDest;
            } else {
                allowDownload = false;
                reject("No download destination provided.");
            }
        }

        if (allowDownload) {
            object.setPreviousDestination(destination);
            await downloadJobQueue.execute(destination);

            //GameManager goes back to being reference to maintain user view
            resolve(object.getGameManager());
        }
    });
}

/**
 * Abort a cancellable task, only if one is currently running (ie. download).
 * @param object The CommandInterpreter where the task instance is stored.
 * @returns {Promise<GameManager>} Resolves once the process has been stopped
 *      and cleaned up.
 */
function stop(object) {
    let inProgress = object.getCancellableTask(); //DownloadJobQueue

    return new Promise(async (resolve) => {
        await inProgress.killProcesses();
        await inProgress.cleanUp();
        resolve(object.getGameManager());
    });
}

/**
 * Gracefully exit the application.
 */
function exit() {
    util.gracefulExit(0);
}

/**
 * Get all the commands that can be run.
 * @returns {function[]} Contains each command as a function.
 */
function getAllCommands() {
    return [get, previous, add, remove, download, stop, exit];
}

/**
 * Get all the commands that create a "cancellable task".
 * @returns {function[]} Contains each command as a function.
 */
function getStoppableCommands() {
    return [download];
}

module.exports = {
    getAllCommands,
    getStoppableCommands,
};