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

        //Take all the command functions and map them
        let commandArray = commands.getAllCommands();
        this.commands = new HashMap();
        for (let command of commandArray) {
            this.commands.set(command.name, command);
        }

        //this.commands.get("retrieveNext")();
        console.log(`Currently viewing: ${this.reference.toString()}`);
    }

    //Pass in a raw string, parse into array
    execute(string) {
        console.log(string);
        this.status = this.statusNames.BUSY;

        return new Promise ((resolve, reject) => {
            let argumentArray = string.split(",");
            let toExecute = this.commands.get(argumentArray[0]);
            argumentArray.shift(); //Anything left is arguments

            //TODO: Invalid command handle won't be needed with UI
            if (toExecute === undefined) {
                console.log("Oops");
                this.status = this.statusNames.READY;
                resolve();
            }

            //Remove command name from array, rest is arguments
            toExecute(this.reference, argumentArray)
                .then(() => {
                    this.status = this.statusNames.READY;
                    resolve();
                })
                .catch(() => {
                    //TODO: Error handling
                    this.status = this.statusNames.READY;
                    reject();
                });
        });
    }

    getReference() {
        return this.reference;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = {
    CommandInterpreter,
};