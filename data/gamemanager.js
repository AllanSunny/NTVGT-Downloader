const util = require("../util/index");
const {Game} = require("./game");

class GameManager {
    constructor() {
        this.games = [];
        this.gameCount = 0;
    }

    addGame() {
        let newGame = new Game(this.gameCount++);

        this.games.push(newGame);
        console.log(`Added new Game! (ID: ${newGame.getID()})`);
    }

    getGame(id) {
        return util.getFromArray(id, this.games, 1);
    }

    removeGame(id) {
        return util.removeFromArray(id, this.games, 1);
    }

    setDestination(root) {
        for (let game of this.games) {
            game.setFilePaths(root);
        }
    }

    async downloadSongs() {
        for (let game of this.games) {
            await game.downloadSongs();
        }
    }
}

module.exports = {
    GameManager,
};