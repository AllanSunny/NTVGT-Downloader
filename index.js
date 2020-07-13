const util = require("./util/index");
const initializer = require("./initializer");
const {GameManager} = require("./data/gamemanager");

async function initialize() {
    await initializer.initialize();
}

//TODO: Data IO
//TODO: Implement async/await chains for commands
function main() {
    let gameManager = new GameManager();

    gameManager.addGame();
    gameManager.getGame(0).addCategory("Wow");
    gameManager.getGame(0).getCategory(0)
        .addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "10", "01:00");

    gameManager.setDestination("./test");

    let thingy = gameManager.getGame(0).downloadSongs();
        //TODO: Command inputs should be blocked until downloads are done

    thingy.then(() => {
        //gameManager.getGame(0).getCategory(0).removeSong(0);
        //gameManager.getGame(0).removeCategory("Wow");
        console.log(gameManager.getGame(0).getCategory(0).toString());
        console.log("owo");
        //TODO: Command input loop would repeat here?
    });
}

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