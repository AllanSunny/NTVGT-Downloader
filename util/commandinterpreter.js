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

        console.log(`Currently viewing: ${this.reference.toString()}`);
    }

    //Pass in a raw string, parse into array
    //This will assume that all arguments have been checked for validity by UI
    execute(string) {
        this.status = this.statusNames.BUSY;

        return new Promise((resolve, reject) => {
            let args = string.split(",");

            //First arg is command, rest is parameters
            let toExecute = this.commands.get(args[0]);
            args.shift();
            if (toExecute === undefined) {
                this.status = this.statusNames.READY;
                reject("Command not found.");
            }

            if (toExecute === this.commands.get('downloadSongs')) {
                this.reference = this.gameManager;
            }

            toExecute(this.reference, args)
                .then((result) => {
                    if (result) {
                        this.reference = result;
                    }

                    console.log(`Currently viewing: ${this.reference.toString()}`);
                    this.status = this.statusNames.READY;
                    resolve(result);
                })
                //TODO: Error handling
                .catch((reason) => {
                    this.status = this.statusNames.READY;
                    reject(reason);
                });
        });
    }

    getReference() {
        return this.reference;
    }

    /**
     * Check if the system is busy processing a command.
     * @returns {boolean} True if busy, false if not.
     */
    isBusy() {
        return this.status === this.statusNames.BUSY;
    }
}

module.exports = {
    CommandInterpreter,
};