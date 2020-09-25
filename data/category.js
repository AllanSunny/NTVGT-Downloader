const util = require("../util/index");
const {Song} = require("./song");
const sanitizer = require("sanitize-filename");

/**
 * This class contains information on a category, storing songs.
 */
class Category {
    /**
     * Create a new category.
     * @param {number} id The ID to associate with the category.
     * @param {string} name The name of the category.
     * @param {Game} game The Game creating the category.
     */
    constructor(id, name, game) {
        this.id = id;
        this.name = name;
        this.songCount = 0; //Incremented on each song for uniqueness
        this.songs = [];
        this.filePath = ""; //Directory to store this category's songs in, set later
        this.game = game;
    }

    /**
     * Get the ID of this category.
     * @returns {number} The ID number of this category.
     */
    getID() {
        return this.id;
    }

    /**
     * Get the name of this category.
     * @returns {string} The name of this category.
     */
    getName() {
        return this.name;
    }

    /**
     * Get all songs currently stored in this category.
     * @returns {Song[]} An array containing all created songs.
     */
    getAll() {
        return this.songs;
    }

    /**
     * Get the game that this category is stored in.
     * @returns {Game} The game object.
     */
    getPrevious() {
        return this.game;
    }

    /**
     * Create a new song and store it in the array of songs. The song's ID
     * will be the total number of categories created thus far.
     * @param {string[]} args Arguments in this order:
     *      [song title, game of origin, youtube link, start time, end time]
     * @returns {Promise} Resolves upon addition to the array, rejects if a song
     *      with the same name and game of origin already exists.
     */
    addData(args) {
        return new Promise((resolve, reject) => {
            let newSongTitle = util.titleCase(args[0]);
            let newSongGame = util.titleCase(args[1]);
            //Attempt to fetch song by name
            let existingCheck = this.getData(newSongTitle);

            if (existingCheck !== undefined && existingCheck.getGameName() === newSongGame) {
                reject("This song has already been added!");
            } else {
                let newSong = new Song(this.songCount++, newSongTitle,
                    newSongGame, args[2], this, args[3], args[4]);

                this.songs.push(newSong);
                console.log(`Added ${newSong.toString()}! (ID: ${newSong.getID()})`);
                resolve();
            }
        });
    }

    /**
     * Get an instance of a song.
     * @param {string|number} id The name (title) or ID number of the song to find.
     * @returns {Song} The song object, or undefined if not found.
     */
    getData(id) {
        return util.getFromArray(id, this.songs);
    }

    /**
     * Remove an instance of a song.
     * @param {string|number} id The name (title) or ID number of the song to remove.
     * @returns {boolean} Whether the removal was successful or not.
     */
    removeData(id) {
        let result = util.removeFromArray(id, this.songs);
        if (result) {
            this.songs = result;
            return true;
        } else { //Removal failed, undefined returned
            return false;
        }
    }

    /**
     * Set the directory path that this category's song files will be stored in,
     * and set the directory path for each song.
     * @param {string} previous The path to the directory that precedes this one.
     */
    setFilePaths(previous) {
        //Sanitizer cleans up directory name in case of OS-reserved chars
        this.filePath = `${previous}/Category ${this.id + 1} - ${sanitizer(this.name)}`;

        for (let song of this.songs) {
            song.setFilePath(this.filePath);
        }
    }

    /**
     * Get the path to this category's directory.
     * @returns {string} The file path.
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Queue up all songs for downloads.
     * @param {DownloadJobQueue} jobQueue The object that will manage the downloads.
     */
    queueDownloads(jobQueue) {
        util.createDirectory(this.filePath);

        for (let song of this.songs) {
            song.queueDownload(jobQueue);
        }
    }

    /**
     * Clean up any leftover files from aborted song downloads.
     */
    cleanUpDownloads() {
        util.removeFilesByExtensions(this.filePath, ['.part', '.ytdl']);
    }

    /**
     * Convert category information into a readable string.
     * @returns {string} Category information in the format:
     *      Category <Name> containing <Song List>
     */
    toString() {
        if (this.songs.length === 0) {
            return `"Category "${this.name}" (ID: ${this.id}) with no songs"`;
        }

        let result = `"Category "${this.name}" (ID: ${this.id}) containing songs: `;
        result += util.arrayToStringList(this.songs) + '"';

        return result;
    }
}

module.exports = {
    Category,
};