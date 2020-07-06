const util = require("../util/index");
const List = require("collections/list");
const Category = require("category");
// A game has categories, which has songs

class Game {
    constructor (gameId) {
        this.gameId = gameId;
        this.categories = new List;
    }

    addCategory (name) {
        this.categories.add(new Category(name));
    }

    toString() {
        let result = "Game " + this.gameId + " containing categories: ";
        result += util.listToString(this.categories);

        return result;
    }
}

module.exports = {
    Game,
};