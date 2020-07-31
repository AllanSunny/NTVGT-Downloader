const commands = require("./commands");
const {HashMap} = require("hashmap");
const {GameManager} = require("../data/gamemanager");

class CommandInterpreter {
    constructor() {
        this.statusNames = {
            READY: Symbol("Ready"),
            BUSY: Symbol("Busy"),
        };

        this.status = this.statusNames.READY;

        let manager = new GameManager();
        this.reference = manager;
        this.gameManager = manager;

        this.executing = undefined;
        this.cancellableTask = undefined;

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

        //First arg is command, rest is parameters for it
        let toExecute = this.commands.get(args[0]);
        args.shift();

        return new Promise((resolve, reject) => {
            if (toExecute === undefined) {
                this.status = this.statusNames.READY;
                reject("Command not found.");
            }

            switch (toExecute.name) {
                case 'download':
                    //Add ability to store running task
                    this.reference = this;
                    break;
                case 'stop':
                    if (this.cancellableTask === undefined ||
                        !this.stoppableCommands.has(this.executing.name)) {
                        this.status = this.statusNames.READY;
                        reject("There is nothing to stop.");
                    } else {
                        //For passing in progress function instance to stop function
                        this.reference = this;
                    }
                    break;
                default: //No setup necessary
                    break;
            }

            this.executing = toExecute;
            toExecute(this.reference, args)
                .then((result) => {
                    if (result) {
                        this.reference = result;
                    }

                    this.status = this.statusNames.READY;
                    this.executing = undefined;
                    this.cancellableTask = undefined;
                    console.log(`Currently viewing: ${this.reference.toString()}`);
                    resolve(result);
                })
                //TODO: Clean up error handling?
                .catch((reason) => {
                    this.status = this.statusNames.READY;
                    this.executing = undefined;
                    this.cancellableTask = undefined;
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
     * Get the instance of the GameManager associated with this CommandInterpreter.
     * @returns {GameManager} The GameManager containing all the data for the session.
     */
    getGameManager() {
        return this.gameManager;
    }

    /**
     * Store the currently running cancellable task.
     * @param task A class instance containing a cancellable task.
     */
    setCancellableTask(task) {
        this.cancellableTask = task;
    }

    /**
     * Retrieve the currently running cancellable task.
     * @returns {object} The task object instance (undefined if nothing is running).
     */
    getCancellableTask() {
        return this.cancellableTask;
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