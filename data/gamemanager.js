const util = require("../util/index");
const {Game} = require("./game");

class GameManager {
    constructor() {
        this.games = [];
        this.gameCount = 0;
    }

    addData() {
        let newGame = new Game(this.gameCount++, this);

        this.games.push(newGame);
        console.log(`Added new Game! (ID: ${newGame.getID()})`);
    }

    //ID must be a number here
    getData(id) {
        return util.getFromArray(id, this.games);
    }

    getAll() {
        return this.games;
    }

    removeData(id) {
        return util.removeFromArray(id, this.games);
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