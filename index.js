const {Game} = require("./data/game");

function initialize() {
    //Load in existing games
}

function main() {
    let games = [];

    games.push(new Game(0));
    games[0].addCategory("Wow");
    games[0].addSong("Accumula Town", "Pokemon Black/White", "https://www.youtube.com/watch?v=dTnZqMpWttY", "Wow");

    console.log("owo");
}

main();