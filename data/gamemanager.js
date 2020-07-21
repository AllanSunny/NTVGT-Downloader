const util = require("../util/index");
const {Game} = require("./game");

class GameManager {
    constructor() {
        this.games = [];
        this.gameCount = 0;
    }

    addGame() {
        let newGame = new Game(this.gameCount++, this);

        this.games.push(newGame);
        console.log(`Added new Game! (ID: ${newGame.getID()})`);
    }

    getGame(id) {
        return util.getFromArray(id, this.games, 1);
    }

    getAll() {
        return this.games;
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

    toString() {
        let resultArray = [];

        for (let game of this.games) {
            resultArray.push(game.getID());
        }

        if (resultArray.length === 0) {
            return `NTVGT session with no games`;
        } else {
            return `NTVGT session containing game IDs: ${resultArray.toString()}`;
        }
    }
}

module.exports = {
    GameManager,
};