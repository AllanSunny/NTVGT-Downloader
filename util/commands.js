
//Object is point of reference, id is name or num
function retrieveNext(object, id) {
    console.log("why");
}

function retrievePrevious(object) {

}

function add(object, ...details) {

}

function remove(object, id) {

}


function getAllCommands(string) {
    return module.exports.commands;
}

module.exports = {
    getAllCommands,
    commands: [retrieveNext, retrievePrevious, add, remove],
};