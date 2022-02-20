const childProcess = require('child_process');
const util = require("./util/index");

/**
 * Do setup before the application starts taking commands.
 * @returns {Promise<void>} Resolves on a successful setup and rejects on an error.
 */
async function initialize() {
    //1: check youtube-dl and config existence
    await checkUtilityExistence("./util/downloadutils/youtube-dl.exe");
    await checkUtilityExistence("./util/downloadutils/ytdlconfig.txt");

    //2: check ffmpeg existence
    await checkUtilityExistence("./util/downloadutils/ffmpeg.exe");

    //3: update youtube-dl
    await updateYoutubeDl();

    //4: load existing games
    //TODO: Implement after save/load system
}

/**
 * Make sure that a specific utility file exists and is accessible.
 * @param {string} path The expected location of the file.
 * @returns {Promise<void>} Resolves if exists, otherwise rejects.
 */
function checkUtilityExistence(path) {
    return new Promise((resolve, reject) => {
        if (!util.checkFileOrDirExistence(path)) {
            console.error(`Could not find ${path}.`);
            reject();
        } else {
            resolve();
        }
    });
}

/**
 * Call on youtube-dl.exe to update itself. It only updates if necessary.
 * @returns {Promise} Resolves once the youtube-dl process is done, rejects on an error.
 */
function updateYoutubeDl() {
    return new Promise(async (resolve, reject) => {
        console.log("Updating youtube-dl...");
        await childProcess.execFile('./util/downloadutils/youtube-dl.exe',
            ['-U', '--no-check-certificate'],
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Could not update youtube-dl.");
                    reject(error);
                } else {
                    console.log(stdout);
                    console.log(`Update done!`);
                    resolve();
                }
            });
    });
}

module.exports = {
    initialize,
};