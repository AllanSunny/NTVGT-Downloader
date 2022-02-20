const util = require("./util/index");
const initializer = require("./initializer");
const {CommandInterpreter} = require("./util/commandinterpreter");
const readLine = require("readline");

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
    let input = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Input> "
    });

    input.prompt(true);

    //Loop for listening for commands
    input.on("line", (line) => {
        line = line.trim();
        let canProcess = true;

        if (line.length === 0) {
            input.prompt(true);
            canProcess = false;
        }
        
        if (canProcess && commandInterpreter.isBusy()) {
            if (line === 'stop') {
                commandInterpreter.execute(line)
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
        } else if (canProcess) {
            commandInterpreter.execute(line)
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
    .catch((error) => {
        console.error("Failed to initialize!");
        console.error(error);
        process.exit(1);
    })

    .then(() => main())
    .catch((error) => {
        console.error("A fatal error occurred.");
        console.error(error.toString());
        util.gracefulExit(1);
    });