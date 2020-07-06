const util = require("../util/index");

class Song {
    constructor (title, vgTitle, ytLink, startTime, duration, categoryName) {
        //StartTime can be in seconds or MM:SS, duration must be in seconds
        this.title = util.titleCase(title);
        this.vgTitle = util.titleCase(vgTitle);
        this.categoryName = categoryName;
        this.ytLink = ytLink;


        if (startTime === undefined) {
            startTime = "00:00";
        }
        if (startTime.indexOf(":") !== -1) {
            startTime = util.parseToMMSS(startTime);
        }
        this.startTime = startTime;

        if (duration === undefined) {
            duration = "00:30";
        }
        this.duration = duration;

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