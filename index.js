const util = require("./util/index");
const initializer = require("./initializer");
const {CommandInterpreter} = require("./util/commandinterpreter");
const readline = require("readline");

async function initialize() {
    await initializer.initialize();
}

//TODO: Data IO
/**
 * The main driver for the application. Currently, commands are taken from
 * stdin, parsed, and executed by a CommandInterpreter object.
 */
function main() {
    let commandInterpreter = new CommandInterpreter(";");
    let input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "BOOBA> "
    });

    input.prompt(true);

    //Loop for listening for commands
    input.on("line", (line) => {
        if (commandInterpreter.isBusy()) {
            if (line.trim() === 'stop') {
                commandInterpreter.execute(line.trim())
                    .then(() => {
                        input.prompt(true);
                    })
                    .catch((reason) => {
                        console.log("An error occurred:");
                        console.log(reason);
                        input.prompt(true);
                    });
            } else {
                console.error("System is busy, please wait...");
                input.prompt(true);
            }
        } else {
            commandInterpreter.execute(line.trim())
                .then((result) => {
                    //if (result) {console.log(result.toString());} //TODO: Use as debug
                    input.prompt(true);
                })
                .catch((reason) => {
                    console.error("An error occurred:");
                    console.error(reason);
                    input.prompt(true);
                });
        }
    });
}


initialize()
    .catch(() => {
        console.error("Failed to initialize!");
        process.exit(1);
    })

    .then(() => main())
    .catch((error) => {
        console.error("A fatal error occurred.");
        console.error(error.toString());
        util.gracefulExit(1);
    });