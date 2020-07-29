const fs = require("fs");
const ytDlUpdater = require("youtube-dl/lib/downloader");
const util = require("./util/index");

async function initialize() {
    //Promise 1: check youtube-dl existence
    let details = await getYoutubeDlDetails();
    await checkUtilityExistence(details.path);

    //Promise 2: check ffmpeg existence
    await checkUtilityExistence("./util/FFMPEG/ffmpeg.exe");

    //Promise 3: update youtube-dl
    //TODO: Maybe try to avoid doing this every time?
    //await updateYoutubeDl();

    //Promise 4: load existing games
    //TODO: Implement after save/load system
}

//Try to get details of youtube-dl
function getYoutubeDlDetails() {
    return new Promise((resolve, reject) => {
        console.log("Getting youtube-dl details...");
        fs.readFile("./node_modules/youtube-dl/bin/details", (err, data) => {
            if (err) {
                console.error("Could not get youtube-dl details.");
                reject();
            }

            resolve(JSON.parse(data.toString()));
        });
    });
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

function updateYoutubeDl() {
    return new Promise((resolve, reject) => {
        console.log("Updating youtube-dl...");
        ytDlUpdater("./node_modules/youtube-dl/bin", (error, done) => {
            if (error) { //A graceful death
                console.error("Could not update youtube-dl.");
                reject();
            } else {
                console.log("Updated youtube-dl.");
                resolve();
            }
        });
    });
}

module.exports = {
    initialize,
};