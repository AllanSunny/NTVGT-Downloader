const util = require("../util/index");

class Song {
    constructor (title, vgTitle, ytLink, startTime, duration, categoryName) {
        this.title = util.titleCase(title);
        this.vgTitle = util.titleCase(vgTitle);
        this.categoryName = categoryName;


        if (startTime === undefined) {
            startTime = "00:00";
        }
        if (startTime.indexOf(":") !== -1) {
            startTime = util.parseToMMSS(startTime);
        }

        if (duration === undefined) {
            duration = "00:30";
        }
    }

    getName() {
        return this.title + " - " + this.vgTitle;
    }

    toString() {
        let result = this.getName();
    }
}

module.exports = {
    Song,
};