const util = require("../util/index");
const {Game} = require("./game");

class GameManager {
    constructor() {
        this.games = [];
        this.gameCount = 0;
    }

    //No arguments necessary, games can be added anytime
    addData() {
        return new Promise((resolve) => {
            let newGame = new Game(this.gameCount++, this);
            this.games.push(newGame);
            console.log(`Added new Game! (ID: ${newGame.getID()})`);
            resolve();
        });
    }

    //ID must be a number here
    getData(id) {
        return util.getFromArray(id, this.games);
    }

    getAll() {
        return this.games;
    }

    removeData(id) {
        this.games = util.removeFromArray(id, this.games);
    }

    setDestination(root) {
        for (let game of this.games) {
            game.setFilePaths(root);
        }
    }

    //JobQueue is the queue all jobs will be added to
    queueDownloads(jobQueue) {
        for (let game of this.games) {
            game.queueDownloads(jobQueue);
        }
    }

    cleanUpDownloads() {
        for (let game of this.games) {
            game.cleanUpDownloads();
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