const util = require("../util/index");
const {Category} = require("./category");

class Game {
    constructor(gameId) {
        this.gameId = gameId;
        this.categories = [];
    }

    addCategory(name) {
        this.categories.push(new Category(name));
    }

    /**
     * Retrieve a specific Category object.
     * @param name The name of the Category.
     */
    getCategory(name) {
        for (let i = 0; i < this.categories.length; i++) {
            let checking = this.categories[i];

            if (checking.getName() === name) {
                return checking;
            }
        }

        //If it gets to this point, category name not found
        console.log("Category name does not exist!");
    }

    addSong (title, vgTitle, ytLink, categoryName, startTime, duration) {
        this.getCategory(categoryName).addSong(title, vgTitle, ytLink, startTime, duration);
    }

    toString() {
        let result = '"Game ' + (this.gameId + 1) + " containing categories: ";
        result += util.listToString(this.categories) + '"';

        return result;
    }
}

module.exports = {
    Game,
};