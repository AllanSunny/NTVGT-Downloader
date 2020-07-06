const util = require("../util/index");
const Song = require("song");
const List = require("collections/list");

class Category {
    constructor(name) {
        this.name = util.titleCase(name);
        this.songs = new List();
    }

    getName() {
        return this.name;
    }

    toString() {
        let result = "Category " + this.name + " containing songs: ";
        result += util.listToString(this.songs);

        return result;
    }
}

module.exports = {
    Category,
};