const util = require("../util/index");
const {DownloadJob} = require("../util/songdownloader");
const timeFormat = require("hh-mm-ss");
const sanitizer = require("sanitize-filename");

/**
 * This class contains information on a song and is the bottom of the data tree.
 */
class Song {
    /**
     * Create a new song.
     * @param {number} id The ID to associate with the song.
     * @param {string} name The title of the song.
     * @param {string} vgName The game the song came from.
     * @param {string} ytLink A link to the song's video on youtube.
     * @param {Category} category The Category creating the song.
     * @param {string} [startTime=00:00] The start time of the desired
     *      audio segment from the video, in "hh:mm:ss" format or seconds.
     *      (must be supplied if a custom endTime is desired)
     * @param {string} [endTime=00:30] The end time of the desired
     *      audio segment from the video, in "hh:mm:ss" format or seconds.
     */
    constructor(id, name, vgName, ytLink, category, startTime, endTime) {
        this.id = id;
        this.name = name;
        this.vgName = vgName;
        this.category = category;
        this.ytLink = ytLink;

        this.startTime = this.parseStartTime(startTime);
        this.endTime = this.parseEndTime(endTime);

        //Duration of audio clip, used by FFMPEG
        this.duration = util.calculateDuration(this.startTime, this.endTime);
        this.filePath = ""; //Directory & name of this song's audio file, set later
    }

    /**
     * Helper function for finding the start time of the audio segment. Defaults to
     * the beginning if none is specified.
     * @param {string} startTime The raw start time input from the user.
     * @returns {string} The start time of the audio segment, in "hh:mm:ss" format.
     */
    parseStartTime(startTime) {
        if (startTime === undefined) {
            startTime = "00:00";
        } else if (startTime.indexOf(":") === -1) {
            let startTimeInt = parseInt(startTime);
            startTime = timeFormat.fromS(startTimeInt);
        } else { //Clean input
            startTime = util.addLeadingZerosTime(startTime);
        }

        return startTime;
    }

    /**
     * Helper function for finding the end time of the audio segment. Defaults to
     * 30 seconds from the start time of the segment.
     * @param {string} endTime The raw end time input from the user.
     * @returns {string} The end time of the audio segment, in "hh:mm:ss" format.
     */
    parseEndTime(endTime) {
        if (endTime === undefined) {
            let startTimeSecs = timeFormat.toS(this.startTime);
            let endTimeSecs = startTimeSecs + 30;
            endTime = timeFormat.fromS(endTimeSecs);
        } else if (endTime.indexOf(":") === -1) {
            let endTimeInt = parseInt(endTime);
            endTime = timeFormat.fromS(endTimeInt);
        } else { //Clean input
            endTime = util.addLeadingZerosTime(endTime);
        }

        return endTime;
    }

    /**
     * Get the ID of this song.
     * @returns {number} The ID number of this song.
     */
    getID() {
        return this.id;
    }

    /**
     * Get the name of this song.
     * @returns {string} The name of this song.
     */
    getName() {
        return this.name;
    }

    /**
     * Get the name of the game this song came from.
     * @returns {string} The name of the game.
     */
    getGameName() {
        return this.vgName;
    }

    /**
     * Get the link to this song's video on youtube.
     * @returns {string} The direct youtube link.
     */
    getYTLink() {
        return this.ytLink;
    }

    /**
     * Get the start time of this song's audio segment.
     * @returns {string} The start time, in "hh:mm:ss" format.
     */
    getStartTime() {
        return this.startTime;
    }

    /**
     * Get the end time of this song's audio segment.
     * @returns {string} The end time, in "hh:mm:ss" format.
     */
    getEndTime() {
        return this.endTime;
    }

    /**
     * Get the duration of this song's audio segment.
     * @returns {number} The duration of the segment, in seconds.
     */
    getDuration() {
        return this.duration;
    }

    /**
     * Get the category that this song is stored in.
     * @returns {Category} The category object.
     */
    getPrevious() {
        return this.category;
    }

    /**
     * Set the path and name for the output of this song's audio file when downloaded.
     * @param {string} previous The path to the directory that precedes this one.
     */
    setFilePath(previous) {
        //Sanitizer cleans up file name in case of OS-reserved chars
        this.filePath = `${previous}/Song ${this.id + 1} - ${sanitizer(this.name)} - ${sanitizer(this.vgName)}.mp3`;
    }

    /**
     * Get the path to this song's audio file.
     * @returns {string} The file path.
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Queue up this song to be downloaded.
     * @param {DownloadJobQueue} jobQueue The object that will manage the download.
     */
    queueDownload(jobQueue) {
        jobQueue.queue.push(jobQueue.limiter(async () => {
            let downloadJob = new DownloadJob(this);
            jobQueue.jobs.push(downloadJob);

            await downloadJob.execute()
                .catch((error) => {
                    console.error(error.toString());
                });
        }));
    }

    /**
     * Convert the song information into a readable string.
     * @returns {string} Song information in the format:
     *      <Song Name> - <Game Name> in category <Category Name> [YouTube Link]
     */
    toString() {
        return `"${this.name} - ${this.vgName}" in category "${this.category.getName()}" [${this.ytLink}]`;
    }
}

module.exports = {
    Song,
};