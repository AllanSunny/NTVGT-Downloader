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
        //TODO
    });
}

//Object passed in will be CommandInterpreter, sole arg is download location
function download(object, args) {
    return new Promise(async (resolve, reject) => {
        console.log("Preparing to download songs... [enter 'stop' at any time to abort]");
        let downloadJobQueue = new DownloadJobQueue(object.getGameManager(), this.name);
        object.setCancellableTask(downloadJobQueue);

        await downloadJobQueue.execute(args[0]);
        //Errors will be handled individually

        //GameManager goes back to being reference to maintain user view
        resolve(object.getGameManager());
    });
}

//Only works if stoppable command is in progress
//Object will be CommandInterpreter
function stop(object, args) {
    let inProgress = object.getCancellableTask(); //DownloadJobQueue

    return new Promise( async (resolve, reject) => {
        if (inProgress.limiter.pendingCount !== 0) {
            inProgress.limiter.clearQueue();
        }

        await inProgress.killProcesses();
        await inProgress.cleanUpDownloads();
        resolve(object.getGameManager());
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
};