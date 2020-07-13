const {Game} = require("./data/game");
const fileSorter = require("./util/fileSorter");

function initialize() {
    //TODO
    //Load in existing games
    //Update youtube-dl
    //Check that ffmpeg exists
}

function main() {
    initialize();

    let games = [];

    games.push(new Game(games.length));
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

main();