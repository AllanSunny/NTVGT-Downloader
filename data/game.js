const util = require("../util/index");
const {Category} = require("./category");

class Game {
    constructor(gameId) {
        this.gameId = gameId;
        this.categories = [];
    }

    //0 index = category id 0
    addCategory(name) {
        this.categories.push(new Category(name, this.categories.length));
    }

    /**
     * Retrieve a specific category.
     * @param id The name or ID number of the category.
     * @returns {Category} The instance of a category.
     */
    getCategory(id) {
        if (isNaN(id)) {
            //Not a number, search by name
            return util.getFromArray(id, this.categories);
        }

        return this.categories[id];
    }

    removeCategory(id) {
        if (isNaN(id)) {
            this.categories = util.removeFromArray(id, this.categories);
        }

        //Get to array index and delete one element @ index
        this.categories = this.categories.splice(id, 1);
    }

    addSong(title, vgTitle, ytLink, categoryName, startTime, endTime) {
        this.getCategory(categoryName).addSong(title, vgTitle, ytLink, startTime, endTime);
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