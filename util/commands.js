const util = require ("./index");

//Object is point of reference, args is name or num (will be in array)
function retrieveNext(object, args) {
    console.log(args);
}

function retrievePrevious(object) {

}

//New Song: add, accumula town, pokemon black/white, link, time, time
function add(object, args) {

}

function remove(object, args) {

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
    commands: [retrieveNext, retrievePrevious, add, remove, exit],
};