const util = require("../util/index");
const {Category} = require("./category");

class Game {
    constructor(gameId) {
        this.id = gameId;
        this.categoryCount = 0;
        this.categories = [];
        this.filePath = "";
    }

    //0 index = category id 0
    addCategory(name) {
        this.categories.push(new Category(name, this.categoryCount++));
    }

    /**
     * Retrieve a specific category.
     * @param id The name or ID number of the category.
     * @returns {Category} The instance of a category.
     */
    getCategory(id) {
        if (isNaN(id)) {
            //Not a number, search by name
            return util.getFromArray(id, this.categories, 0);
        } else {
            return util.getFromArray(id, this.categories, 1);
        }
    }

    removeCategory(id) {
        if (isNaN(id)) {
            this.categories = util.removeFromArray(id, this.categories, 0);
        } else {
            this.categories = util.removeFromArray(id, this.categories, 1);
        }
    }

    /**
     *
     * @param previous The path to the folder that precedes this one.
     */
    setFilePaths(previous) {
        this.filePath = `${previous}/Game ${this.id + 1}`;

        for (let category of this.categories) {
            category.setFilePaths(this.filePath);
        }
    }

    async downloadSongs() {
        for (let category of this.categories) {
            await category.downloadSongs();
        }
    }

    toString() {
        let result = '"Game ' + (this.id + 1) + " containing categories: ";
        result += util.listToString(this.categories) + '"';

        return result;
    }
}

module.exports = {
    Game,
};