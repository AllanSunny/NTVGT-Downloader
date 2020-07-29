const util = require ("./index");
const pLimit = require("p-limit");

//Object is point of reference, args is name or num (will be in array)
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

function getAll(object) {
    return new Promise((resolve) => resolve(object.getAll()));
}

//New Song: add, accumula town, pokemon black/white, link, time, time
//Responsibility of parsing argument array delegated to data objects (for additions only)
function add(object, args) {
    return new Promise((resolve, reject) => {
        object.addData(args)
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            })
    });
}

function remove(object, args) {
    return new Promise((resolve, reject) => {

    });
}

//Sole arg is root folder path
function download(gameManager, args) {
    return new Promise(async (resolve, reject) => {
        console.log("Preparing to download songs... [enter 'stop' at any time to abort]");
        this.queue = [];
        this.limiter = pLimit(3);
        gameManager.setDestination(args[0]);
        gameManager.queueDownloads(this);

        //console.log("Starting downloads...");
        await Promise.all(this.queue)
            .then(() => {
                console.log("Downloads complete!");
                resolve();
            })
            .catch((error) => {
                if (error) {
                    console.error(error);
                    reject("An error occurred during a download.");
                }
            });
    });
}

//Only works if stoppable command is in progress
//Sole arg here will be the downloadSong function in progress
function stop(object, args) {
    let inProgress = args[0];

    return new Promise((resolve, reject) => {
        if (typeof inProgress !== "function") {
            resolve(); //Nothing happens
        }

        inProgress.limiter.clearQueue();
        //TODO: Find and kill any running youtube-dl processes
        console.log("Downloads aborted.");
        resolve();
    });
}

function exit() {
    //TODO
    util.gracefulExit(0);
}

function getAllCommands() {
    return [get, previous, getAll, add, remove, download, stop, exit];
}

function getStoppableCommands() {
    return [download];
}

module.exports = {
    getAllCommands,
    getStoppableCommands,
    //commands: [get, previous, getAll, add, remove, download, stop, exit],
    //stoppableCommands: [download],
};