const util = require ("./index");

//Object is point of reference, args is name or num (will be in array)
function get(object, args) {
    let id = args[0];

    if (util.isNumber(id)) {
        id = parseInt(id);
    }

    return new Promise((resolve, reject) => {
        let result;
        console.log(object.hasOwnProperty('getData'));
        console.log(typeof object.prototype);
        console.log('getData' in object);

        if (typeof object.getData === "function") {
            console.log("Hello)");
            result = object.getData(id);
        }

        if (result) {
            resolve(result);
        } else {
            reject("Could not find that data.");
        }
    });
}

function previous(object) {

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
    let id = args[0];

    if (util.isNumber(id)) {
        id = parseInt(id);
    }
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
    commands: [get, previous, getAll, add, remove, exit],
};