const {Game} = require("./data/game");
const ytdlupdater = require("youtube-dl/lib/downloader");
const {GameManager} = require("./data/gamemanager");

async function initialize() {
    return new Promise((resolve, reject) => {
        //TODO
        //Promise 1: load existing games
        //Promise 2: check ffmpeg existence
        //Promise 3: update youtube-dl
        //Any errors? Catch and reject

        resolve();
        //TODO: store version of youtube-dl, check against version of exe file

        // console.log("Updating youtube-dl...");
        // ytdlupdater("./node_modules/youtube-dl/bin", (error, done) => {
        //     if (error) { //A graceful death
        //         console.error("Could not update youtube-dl.");
        //         console.error(error);
        //         reject();
        //     } else {
        //         console.log("Updated youtube-dl.");
        //         resolve();
        //     }
        // });
    });
}

function main() {
    let gameManager = new GameManager();

    gameManager.addGame();
    gameManager.getGame(0).addCategory("Wow");
    gameManager.getGame(0).getCategory(0)
        .addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "10", "01:00");

    gameManager.setDestination("./test");
    //gameManager.getGame(0).getCategory(0).removeSong(0);

    let thingy = gameManager.getGame(0).downloadSongs();
        //TODO: What happens if data structure changes after a round of downloads?
        //TODO: Command inputs should be blocked until downloads are done

    thingy.then(() => {
        gameManager.getGame(0).removeCategory("Wow");
        console.log(gameManager.getGame(0).getCategory(0));
        console.log("owo");
        //TODO: Command input loop would repeat here?
    });
}

initialize()
    .catch(() => {
        console.log("Failed to initialize!");
        process.exit(1);
    })
    .then(() => main());