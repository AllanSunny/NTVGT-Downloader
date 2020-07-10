const {Game} = require("./data/game");

function initialize() {
    //Load in existing games
}

function main() {
    let games = [];

    games.push(new Game(0));
    games[0].addCategory("Wow");
    games[0].addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "Wow", "10", "10:10");
    games[0].getCategory("Wow").getSong("Accumula Town - Pokemon Black/White").downloadSong("./test/whoa.mp3");

    games[0].removeCategory("Wow");

    console.log(games[0].toString());

    console.log("owo");
}

main();