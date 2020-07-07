const util = require("../util/index");
const downloader = require("../util/songdownloader");
const TimeFormat = require("hh-mm-ss");

class Song {

    constructor(title, vgTitle, ytLink, categoryName, startTime, endTime) {
        //StartTime and EndTime can be in seconds or MM:SS (also optional)- should be strings
        this.title = util.titleCase(title);
        this.vgTitle = util.titleCase(vgTitle);
        this.categoryName = categoryName;
        this.ytLink = ytLink;


        if (startTime === undefined) {
            startTime = "00:00";
        } else if (startTime.indexOf(":") === -1) {
            let startTimeInt = parseInt(startTime);
            startTime = TimeFormat.fromS(startTimeInt);
        }

        //StartTime is stored in mm:ss format
        this.startTime = startTime;


        if (endTime === undefined) {
            let startTimeSecs = TimeFormat.toS(startTime);
            let endTimeSecs = startTimeSecs + 30;
            endTime = TimeFormat.fromS(endTimeSecs);
        } else if (endTime.indexOf(":") === -1) {
            let endTimeInt = parseInt(endTime);
            endTime = TimeFormat.fromS(endTimeInt);
        }

        //EndTime is stored in mm:ss format
        this.endTime = endTime;


        //TODO: Might be able to remove this
        this.duration = util.calculateDuration(startTime, endTime);
    }

    getName() {
        return this.title + " - " + this.vgTitle;
    }

    downloadSong(destination) {
        downloader.downloadSong(this.ytLink, this.startTime, this.duration, destination);
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