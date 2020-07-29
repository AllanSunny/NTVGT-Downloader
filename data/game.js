const util = require("../util/index");
const {Category} = require("./category");

class Game {
    constructor(gameId, gameManager) {
        this.id = gameId;
        this.categoryCount = 0;
        this.categories = [];
        this.filePath = "";
        this.gameManager = gameManager;
    }

    getID() {
        return this.id;
    }

    getAll() {
        return this.categories;
    }

    getPrevious() {
        return this.gameManager;
    }

    //Only one arg: category name
    addData(args) {
        return new Promise((resolve, reject) => {
            let newName = util.titleCase(args[0]);

            if (this.getData(newName) !== undefined) {
                reject("This category name already exists!");
            }

            let newCategory = new Category(newName, this.categoryCount++, this);
            this.categories.push(newCategory);
            console.log(`Added new Category "${newCategory.getName()}"!`);
            resolve();
        });

    }

    /**
     * Retrieve a specific category.
     * @param id The name or ID number of the category.
     * @returns {Category} The instance of a category.
     */
    getData(id) {
        return util.getFromArray(id, this.categories);
    }

    removeData(id) {
        this.categories = util.removeFromArray(id, this.categories);
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

    getFilePath() {
        return this.filePath;
    }

    queueDownloads(func) {
        for (let category of this.categories) {
            category.queueDownloads(func);
        }
    }

    // async downloadSongs() {
    //     for (let category of this.categories) {
    //         await category.downloadSongs();
    //     }
    // }

    toString() {
        if (this.categories.length === 0) {
            return `"Game ${this.id + 1} (ID ${this.id}) with no categories"`;
        }

        let result = `"Game ${this.id + 1} (ID ${this.id}) containing categories: `;
        result += util.listToString(this.categories) + '"';

        return result;
    }
}

module.exports = {
    Game,
};