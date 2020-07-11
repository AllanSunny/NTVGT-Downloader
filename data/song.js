const util = require("../util/index");
const downloader = require("../util/songdownloader");
const timeFormat = require("hh-mm-ss");

class Song {

    constructor(title, vgTitle, ytLink, categoryName, startTime, endTime) {
        //StartTime and EndTime can be in seconds or MM:SS (also optional)- should be strings
        this.title = util.titleCase(title);
        this.vgTitle = util.titleCase(vgTitle);
        this.categoryName = categoryName;
        this.ytLink = ytLink;

        this.parseStartTime(startTime);
        this.parseEndTime(endTime);

        this.duration = util.calculateDuration(this.startTime, this.endTime);
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

    downloadSong(destination) {
        return new Promise((resolve, reject) => {
            downloader.downloadSong(this)
                .then(() => downloader.trimSong(this))
                .then(() => downloader.deleteTemp(this))
                .then(() => {
                    console.log(`*Completed download of ${this.getName()}!*`);
                    resolve();
                })
                .catch(() => {
                    console.log("WTF");
                    reject();
                });
        });
    }

    getName() {
        return this.title + " - " + this.vgTitle;
    }

    /**
     * Convert the song information into a readable string.
     * @returns {string} Song information in the format:
     *      <Song Name> - <Game Name> in category <Category Name> [YouTube Link]
     */
    toString() {
        return '"' + this.getName() + " in category " + this.categoryName + " [" + this.ytLink + ']"';
    }
}

module.exports = {
    Song,
};