const commands = require("./commands");
const {HashMap} = require("hashmap");

class CommandInterpreter {
    constructor(gameManager) {
        this.statusNames = {
            READY: Symbol("Ready"),
            BUSY: Symbol("Busy"),
        };

        this.status = this.statusNames.READY;

        this.reference = gameManager;
        this.gameManager = gameManager;

        let wow = commands.getAllCommands();

        let thing = new HashMap();
        for (let command of wow) {
            thing.set(command.name, command);
        }

        thing.get("retrieveNext")();
    }


    getStatus() {
        return this.status;
    }


}

let wow = new CommandInterpreter();

module.exports = {
    CommandInterpreter,
};