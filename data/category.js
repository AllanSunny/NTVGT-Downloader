const util = require("../util/index");
const {Song} = require("./song");
const fs = require("fs");
const sanitizer = require("sanitize-filename");

class Category {
    constructor(name, id, game) {
        this.id = id;
        this.name = util.titleCase(name);
        this.songCount = 0;
        this.songs = [];
        this.filePath = "";
        this.game = game;
    }

    getName() {
        return this.name;
    }

    getID() {
        return this.id;
    }

    getAll() {
        return this.songs;
    }

    getPrevious() {
        return this.game;
    }

    addData(title, vgTitle, ytLink, startTime, endTime) {
        let newSong = new Song(this.songCount++, title, vgTitle, ytLink, this, startTime, endTime);

        this.songs.push(newSong);
        console.log(`Added ${newSong.toString()}!`);
    }

    getData(id) {
        return util.getFromArray(id, this.songs);
    }

    removeData(id) {
        this.songs = util.removeFromArray(id, this.songs);
    }

    /**
     *
     * @param previous The path to the folder that precedes this one.
     */
    setFilePaths(previous) {
        this.filePath = `${previous}/Category ${this.id + 1} - ${sanitizer(this.name)}`;

        for (let song of this.songs) {
            song.setFilePath(this.filePath);
        }
    }

    getFilePath() {
        return this.filePath;
    }

    queueDownloads(func) {
        util.createDirectory(this.filePath);

        for (let song of this.songs) {
            song.queueDownload(func);
        }
    }

    // async downloadSongs() {
    //     if (!util.checkFileOrDirExistence(this.filePath)) {
    //         await fs.promises.mkdir(this.filePath, {recursive: true});
    //     }
    //
    //     for (let song of this.songs) {
    //         await song.downloadSong()
    //             .catch((error) => {
    //                 console.error(error.stderr);
    //             });
    //     }
    // }

    toString() {
        if (this.songs.length === 0) {
            return `"Category "${this.name}" with no songs"`;
        }

        let result = `"Category "${this.name}" containing songs: `;
        result += util.listToString(this.songs) + '"';

        return result;
    }
}

module.exports = {
    Category,
};