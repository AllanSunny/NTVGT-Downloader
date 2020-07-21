const util = require ("./index");

//Object is point of reference, args is name or num (will be in array)
function retrieveNext(object, args) {
    //TODO: Return a promise to handle invalid input lengths
    this.expectedArgs = 1;
    console.log(args);
}

function retrievePrevious(object) {

}

//New Song: add, accumula town, pokemon black/white, link, time, time
//Responsibility of parsing argument array delegated to data objects (for additions only)
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