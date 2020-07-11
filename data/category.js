const util = require("../util/index");
const {Song} = require("./song");

class Category {
    constructor(name, id) {
        this.name = util.titleCase(name);
        this.songs = [];
        this.id = id;
    }

    getName() {
        return this.name;
    }

    getID() {
        return this.id;
    }

    addSong(title, vgTitle, ytLink, startTime, endTime) {
        let newSong = new Song(this.songs.length, title, vgTitle, ytLink, this.name, startTime, endTime);

        this.songs.push(newSong);
        console.log("Added " + newSong.toString());
    }

    getSong(id) {
        if (isNaN(id)) {
            //Not a number, search by name
            return util.getFromArray(id, this.songs);
        }

        return this.songs[id];
    }

    removeSong(id) {
        if (isNaN(id)) {
            this.songs = util.removeFromArray(id, this.songs);
        }

        //Get to array index and delete one element @ index
        this.songs = this.songs.splice(id, 1);
    }

    toString() {
        let result = '"Category "' + this.name + '" containing songs: ';
        result += util.listToString(this.songs) + '"';

        return result;
    }
}

module.exports = {
    Category,
};