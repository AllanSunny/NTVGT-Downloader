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

    getCategory(name) {
        return util.getFromArray(name, this.categories);
    }

    removeCategory(name) {
        this.categories = util.removeFromArray(name, this.categories);
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