const {Game} = require("./data/game");
const fileSorter = require("./util/fileSorter");
const ytdlupdater = require("youtube-dl/lib/downloader");

function initialize() {
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
    let games = [];
    let gameCount = 0;

    games.push(new Game(gameCount++));
    games[0].addCategory("Wow");
    games[0].addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "Wow", "10", "01:00");

    fileSorter.setDestinations(games, "./test");
    let thingy = games[0].downloadSongs();
        //TODO: What happens if data structure changes after a round of downloads?
        //TODO: Command inputs should be blocked until downloads are done

    thingy.then(() => {
        games[0].removeCategory("Wow");
        console.log(games[0].getCategory("Wow"));
        console.log("owo");
        //TODO: Command input loop would repeat here?
    });
}

initialize()
    .then(() => main())
    .catch(() => {
        console.log("Failed to initialize!!");
    });