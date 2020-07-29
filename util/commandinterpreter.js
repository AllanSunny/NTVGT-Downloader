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
        this.executing = undefined;

        //Take all the command functions and map them
        let commandList = commands.getAllCommands();
        this.commands = new HashMap();
        for (let command of commandList) {
            this.commands.set(command.name, command);
        }

        let stoppableCommands = commands.getStoppableCommands();
        this.stoppableCommands = new HashMap();
        for (let command of stoppableCommands) {
            this.stoppableCommands.set(command.name, command);
        }

        //Ready to go!
        console.log(`Currently viewing: ${this.reference.toString()}`);
    }

    //Pass in a raw string, parse into array
    //This will assume that all arguments have been checked for validity by UI
    execute(string) {
        this.status = this.statusNames.BUSY;
        let args = string.split(",");

        //First arg is command, rest is parameters
        let toExecute = this.commands.get(args[0]);
        args.shift();

        //Downloads must start at the root of the data tree
        if (toExecute === this.commands.get('downloadSongs')) {
            this.reference = this.gameManager;
        }

        return new Promise((resolve, reject) => {
            if (toExecute === undefined) {
                this.status = this.statusNames.READY;
                reject("Command not found.");
            }

            if (toExecute === this.commands.get('stop')) {
                if (!this.stoppableCommands.has(this.executing)) {
                    reject("There is nothing to stop.");
                } else {
                    args[0] = this.executing; //Pass function instance into stop function
                }
            }

            this.executing = toExecute;
            toExecute(this.reference, args)
                .then((result) => {
                    if (result) {
                        this.reference = result;
                    }

                    console.log(`Currently viewing: ${this.reference.toString()}`);
                    this.status = this.statusNames.READY;
                    this.executing = undefined;
                    resolve(result);
                })
                //TODO: Error handling?
                .catch((reason) => {
                    this.status = this.statusNames.READY;
                    this.executing = undefined;
                    reject(reason);
                });
        });
    }

    /**
     * Get the object that is currently being used as a point of reference.
     * @returns {object} The object the user is currently about to modify.
     */
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