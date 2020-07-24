const util = require("./util/index");
const initializer = require("./initializer");
const {GameManager} = require("./data/gamemanager");
const {CommandInterpreter} = require("./util/commandinterpreter");
const readline = require("readline");

async function initialize() {
    await initializer.initialize();
}

//TODO: Data IO
function main() {
    let gameManager = new GameManager(); //TODO: This might not need to be here
    let commandInterpreter = new CommandInterpreter(gameManager);
    let input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "BOOBA> "
    });

    input.prompt(true);

    //Loop for listening for commands
    input.on("line", (line) => {
        if (commandInterpreter.isBusy()) {
            //TODO: Allow abort downloading
            console.error("System is busy, please wait...");
            input.prompt(true);
        } else {
            commandInterpreter.execute(line.trim())
                .then((result) => {
                    //if (result) {console.log(result.toString());} //TODO: Use as debug
                    input.prompt(true);
                })
                .catch(() => {
                    //TODO
                    console.log("An error occurred:");
                    input.prompt(true);
                });
        }
    });
}

    // let gameManager = new GameManager();
    //
    // gameManager.addGame();
    // gameManager.getGame(0).addCategory("Wow");
    // gameManager.getGame(0).getCategory(0)
    //     .addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "10", "01:00");
    //
    // gameManager.setDestination("./test");
    //
    // let thingy = gameManager.getGame(0).downloadSongs();
    //     //TODO: Command inputs should be blocked until downloads are done
    //
    // thingy.then(() => {
    //     //gameManager.getGame(0).getCategory(0).removeSong(0);
    //     //gameManager.getGame(0).removeCategory("Wow");
    //     console.log(gameManager.getGame(0).getCategory(0).toString());
    //     console.log("owo");
    // });
    // }


initialize()
    .catch((error) => {
        console.error(error);
        console.error("Failed to initialize!");
        process.exit(1);
    })

    .then(() => main())
    .catch((error) => {
        console.error("A fatal error occurred.");
        console.error(error);
        util.gracefulExit(1);
    });