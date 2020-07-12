const {Game} = require("./data/game");
const fileSorter = require("./util/fileSorter");

function initialize() {
    //Load in existing games
}

function main() {
    let games = [];

    games.push(new Game(games.length));
    games[0].addCategory("Wow");
    games[0].addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "Wow", "10", "01:00");

    fileSorter.setDestinations(games, "./test");
    let thingy = games[0].getCategory(0).getSong(0).downloadSong("./test/whoa.mp3");

    thingy.then(() => {
        games[0].removeCategory("Wow");
        console.log(games[0].getCategory("Wow"));
        console.log("owo");
        //TODO: Command input loop would repeat here?
    });
}

main();