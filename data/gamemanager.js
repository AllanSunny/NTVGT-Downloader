const util = require("../util/index");
const {Game} = require("./game");

/**
 * This class is the top of the data tree, storing games (rounds).
 */
class GameManager {
    constructor() {
        this.games = [];
        this.gameCount = 0; //Incremented on each game for uniqueness
    }

    /**
     * Create a new game and store it in the array of games. The game's
     * ID will be the total number of games created thus far.
     * @returns {Promise} Resolves upon addition to the array.
     */
    addData() {
        return new Promise((resolve) => {
            let newGame = new Game(this.gameCount++, this);
            this.games.push(newGame);
            console.log(`Added new Game! (ID: ${newGame.getID()})`);
            resolve();
        });
    }

    /**
     * Retrieve an instance of a game (games only have a numerical ID).
     * @param id The ID number of the game to find.
     * @returns {object} The game object, or undefined if it couldn't be found.
     */
    getData(id) {
        return util.getFromArray(id, this.games);
    }

    /**
     * Retrieve all games currently stored in this game manager.
     * @returns {Game[]} An array containing all created games.
     */
    getAll() {
        return this.games;
    }

    /**
     * Remove an instance of a game.
     * @param id The ID number of the game to remove.
     * @returns {boolean} Whether the removal was successful or not.
     */
    removeData(id) {
        let result = util.removeFromArray(id, this.games);
        if (result) {
            this.games = result;
            return true;
        } else { //Removal failed, undefined returned
            return false;
        }
    }

    /**
     * Go through the data tree and set up the directory structure for
     * downloading songs.
     * @param root The root directory to store files in.
     */
    setDestination(root) {
        for (let game of this.games) {
            game.setFilePaths(root);
        }
    }

    /**
     * Queue up all songs for downloads.
     * @param jobQueue The DownloadJobQueue that will manage the downloads.
     */
    queueDownloads(jobQueue) {
        for (let game of this.games) {
            game.queueDownloads(jobQueue);
        }
    }

    /**
     * Clean up any leftover files from aborted song downloads.
     */
    cleanUpDownloads() {
        for (let game of this.games) {
            game.cleanUpDownloads();
        }
    }

    /**
     * Convert game manager information into a readable string.
     * @returns {string} Shows the IDs of all currently created games, if any.
     */
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