const util = require("../util/index");
const {Song} = require("./song");

class Category {
    constructor(name) {
        this.name = util.titleCase(name);
        this.songs = [];
    }

    getName() {
        return this.name;
    }

    addSong(title, vgTitle, ytLink, startTime, duration) {
        let newSong = new Song(title, vgTitle, ytLink, startTime, duration, this.name);

        this.songs.push(newSong);
        console.log("Added " + newSong.toString());
    }

    toString() {
        let result = '"Category ' + this.name + ' containing songs: ';
        result += util.listToString(this.songs) + '"';

        return result;
    }
}

module.exports = {
    Category,
};