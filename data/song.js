const util = require("../util/index");
const downloader = require("../util/songdownloader");
const timeFormat = require("hh-mm-ss");
const sanitizer = require("sanitize-filename");

class Song {

    constructor(id, name, vgName, ytLink, categoryName, startTime, endTime) {
        //StartTime and EndTime can be in seconds or MM:SS (also optional)- should be strings
        this.id = id;
        this.name = util.titleCase(name);
        this.vgName = util.titleCase(vgName);
        this.categoryName = categoryName;
        this.ytLink = ytLink;

        this.parseStartTime(startTime);
        this.parseEndTime(endTime);

        this.duration = util.calculateDuration(this.startTime, this.endTime);
        this.filePath = ""; //Gets assigned later
    }

    parseStartTime(startTime) {
        if (startTime === undefined) {
            startTime = "00:00";
        } else if (startTime.indexOf(":") === -1) {
            let startTimeInt = parseInt(startTime);
            startTime = timeFormat.fromS(startTimeInt);
        }

        //StartTime is stored in mm:ss format
        this.startTime = startTime;
    }

    parseEndTime(endTime) {
        if (endTime === undefined) {
            let startTimeSecs = timeFormat.toS(this.startTime);
            let endTimeSecs = startTimeSecs + 30;
            endTime = timeFormat.fromS(endTimeSecs);
        } else if (endTime.indexOf(":") === -1) {
            let endTimeInt = parseInt(endTime);
            endTime = timeFormat.fromS(endTimeInt);
        }

        //EndTime is stored in mm:ss format
        this.endTime = endTime;
    }

    async downloadSong() {
        return new Promise((resolve, reject) => {
            downloader.downloadSong(this)
                .then(() => downloader.trimSong(this))
                .then(() => downloader.deleteTemp(this))
                .then(() => {
                    console.log(`*Completed download of ${this.name} - ${this.vgName}!*`);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getID() {
        return this.id;
    }

    getGameName() {
        return this.vgName;
    }

    getName() {
        return this.name;
    }

    /**
     *
     * @param previous The path to the folder that precedes this one.
     */
    setFilePath(previous) {
        this.filePath = `${previous}/Song ${this.id + 1} - ${sanitizer(this.name)} - ${sanitizer(this.vgName)}`;
    }

    getFilePath() {
        return this.filePath;
    }

    /**
     * Convert the song information into a readable string.
     * @returns {string} Song information in the format:
     *      <Song Name> - <Game Name> in category <Category Name> [YouTube Link]
     */
    toString() {
        return `"${this.name} - ${this.vgName} in category "${this.categoryName}" [${this.ytLink}]"`;
    }
}

module.exports = {
    Song,
};