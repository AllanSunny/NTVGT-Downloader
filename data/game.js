const util = require("../util/index");
const {Category} = require("./category");

/**
 * This class contains information on a game (round), storing categories.
 */
class Game {
    /**
     * Create a new game.
     * @param {number} id The ID to associate with the game.
     * @param {GameManager} gameManager The GameManager creating the game.
     */
    constructor(id, gameManager) {
        this.id = id;
        this.categoryCount = 0; //Incremented on each category for uniqueness
        this.categories = [];
        this.filePath = ""; //Directory to store this game's categories in, set later
        this.gameManager = gameManager;
    }

    /**
     * Get the ID of this game.
     * @returns {number} The ID number of this game.
     */
    getID() {
        return this.id;
    }

    /**
     * Get all categories currently stored in this game.
     * @returns {Category[]} An array containing all created categories.
     */
    getAll() {
        return this.categories;
    }

    /**
     * Get the game manager that this game is stored in.
     * @returns {GameManager} The game manager object.
     */
    getPrevious() {
        return this.gameManager;
    }

    /**
     * Create a new category and store it in the array of categories. The category's
     * ID will be the total number of categories created thus far.
     * @param {string[]} args Arguments in this order: [category name]
     * @returns {Promise} Resolves upon addition to the array, rejects if a category
     *      with the same name already exists.
     */
    addData(args) {
        return new Promise((resolve, reject) => {
            let newName = util.titleCase(args[0]);

            if (this.getData(newName) !== undefined) {
                reject("This category name already exists!");
            } else {
                let newCategory = new Category(this.categoryCount++, newName, this);
                this.categories.push(newCategory);
                console.log(`Added new Category "${newCategory.getName()}"!`);
                resolve();
            }
        });

    }

    /**
     * Get an instance of a category.
     * @param {string|number} id The name or ID number of the category to find.
     * @returns {Category} The category object, or undefined if not found.
     */
    getData(id) {
        return util.getFromArray(id, this.categories);
    }

    /**
     * Remove an instance of a category.
     * @param {string|number} id The name or ID number of the category to remove.
     * @returns {boolean} Whether the removal was successful or not.
     */
    removeData(id) {
        let result = util.removeFromArray(id, this.categories);
        if (result) {
            this.categories = result;
            return true;
        } else { //Removal failed, undefined returned
            return false;
        }
    }

    /**
     * Set the directory path that this game's categories will be stored in,
     * and set the directory path for each category.
     * @param {string} previous The path to the directory that precedes this one.
     */
    setFilePaths(previous) {
        this.filePath = `${previous}/Game ${this.id + 1}`;

        for (let category of this.categories) {
            category.setFilePaths(this.filePath);
        }
    }

    /**
     * Get the path to this game's directory.
     * @returns {string} The file path.
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Queue up all songs for downloads.
     * @param {DownloadJobQueue} jobQueue The object that will manage the downloads.
     */
    queueDownloads(jobQueue) {
        for (let category of this.categories) {
            category.queueDownloads(jobQueue);
        }
    }

    /**
     * Clean up any leftover files from aborted song downloads.
     */
    cleanUpDownloads() {
        for (let category of this.categories) {
            category.cleanUpDownloads();
        }
    }

    /**
     * Convert game information into a readable string.
     * @returns {string} Game information in the format:
     *      Game <Human ID> (ID <Internal ID>) containing <Category List>
     */
    toString() {
        if (this.categories.length === 0) {
            return `"Game ${this.id + 1} (ID ${this.id}) with no categories"`;
        }

        let result = `"Game ${this.id + 1} (ID ${this.id}) containing categories: `;
        result += util.arrayToStringList(this.categories) + '"';

        return result;
    }
}

module.exports = {
    Game,
};