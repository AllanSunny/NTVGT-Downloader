const util = require ("./index");
const queue = require("queue");

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
    return new Promise((resolve) => {
        object.addData(args);
        resolve();
    })
}

function remove(object, args) {

}

//Sole arg is root folder path
function downloadSongs(gameManager, args) {
    return new Promise((resolve, reject) => {
        console.log("Queueing downloads...");
        this.downloadQueue = queue({concurrency: 3});
        gameManager.setDestination(args[0]);
        gameManager.queueDownloads(this);

        console.log("Starting downloads...");
        this.downloadQueue.start((error) => {
            if (error) {
                console.error("An error occurred during a download:");
                console.error(error);
                reject();
            } else {
                console.log("Downloads complete!");
                resolve();
            }
        });
        //TODO: queue.end when abort
    });
}

function exit() {
    //TODO
    util.gracefulExit(0);
}

function getAllCommands() {
    return module.exports.commands;
}

module.exports = {
    getAllCommands,
    commands: [get, previous, getAll, add, remove, downloadSongs, exit],
};