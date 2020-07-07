const util = require("../util/index");
const {downloader} = require("../util/songdownloader");
const {TimeFormat} = require("hh-mm-ss");

class Song {

    constructor(title, vgTitle, ytLink, startTime, endTime, categoryName) {
        //StartTime and EndTime can be in seconds or MM:SS (also optional)
        this.title = util.titleCase(title);
        this.vgTitle = util.titleCase(vgTitle);
        this.categoryName = categoryName;
        this.ytLink = ytLink;


        if (startTime === undefined) {
            startTime = "00:00";
        }
        if (startTime.indexOf(":") === -1) {
            startTime = TimeFormat.fromS(startTime);
            //startTime = util.parseToMMSS(startTime);
        }
        this.startTime = startTime;

        if (endTime === undefined) {
            endTime = TimeFormat.toS(startTime) + 30;
            //Default song clip duration is 30 seconds
        }
        if (endTime.indexOf(":") === -1) {
            endTime = TimeFormat.fromS(endTime);
        }
        this.endTime = endTime;
    }

    getName() {
        return this.title + " - " + this.vgTitle;
    }

    downloadSong() {
        downloader.downloadSong(this.ytLink, this.startTime, this.endTime);
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