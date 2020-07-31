const childProcess = require('child_process');
const util = require("./util/index");

async function initialize() {
    //Promise 1: check youtube-dl and config existence
    await checkUtilityExistence("./util/downloadutils/youtube-dl.exe");
    await checkUtilityExistence("./util/downloadutils/ytdlconfig.txt");

    //Promise 2: check ffmpeg existence
    await checkUtilityExistence("./util/downloadutils/ffmpeg.exe");

    //Promise 3: update youtube-dl
    await updateYoutubeDl();

    //Promise 4: load existing games
    //TODO: Implement after save/load system
}

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

//The utility will not update if it is already up to date
function updateYoutubeDl() {
    return new Promise(async (resolve, reject) => {
        console.log("Updating youtube-dl...");
        await childProcess.execFile('./util/downloadutils/youtube-dl.exe', ['-U'],
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Could not update youtube-dl.");
                    reject(error);
                } else {
                    console.log(stdout);
                    console.log(`Updated youtube-dl!`);
                    resolve();
                }
            });
    });
}

module.exports = {
    initialize,
};