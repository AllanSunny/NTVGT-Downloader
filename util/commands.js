const util = require ("./index");
const {DownloadJobQueue} = require("./songdownloader");

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

//New Song: add, accumula town, pokemon black/white, link, time, time
//Responsibility of parsing argument array delegated to data objects (for additions only)
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

//Sole arg is name or num to delete
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

//Object passed in will be CommandInterpreter, args: dl location, limit on concurrent dls (optional)
function download(object, args) {
    return new Promise(async (resolve) => {
        console.log("Preparing to download songs... [enter 'stop' at any time to abort]");
        let downloadJobQueue = new DownloadJobQueue(object.getGameManager(), args[1]);
        object.setCancellableTask(downloadJobQueue);

        await downloadJobQueue.execute(args[0]);
        //Errors will be handled individually

        //GameManager goes back to being reference to maintain user view
        resolve(object.getGameManager());
    });
}

//Only works if stoppable command is in progress
//Object will be CommandInterpreter
function stop(object) {
    let inProgress = object.getCancellableTask(); //DownloadJobQueue

    return new Promise(async (resolve) => {
        if (inProgress.limiter.pendingCount !== 0) {
            inProgress.limiter.clearQueue();
        }

        await inProgress.killProcesses();
        await inProgress.cleanUp();
        resolve(object.getGameManager());
    });
}

function exit() {
    util.gracefulExit(0);
}

function getAllCommands() {
    return [get, previous, add, remove, download, stop, exit];
}

function getStoppableCommands() {
    return [download];
}

module.exports = {
    getAllCommands,
    getStoppableCommands,
};