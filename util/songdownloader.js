const childProcess = require('child_process');
const fs = require("fs");
const util = require("./index");
const pLimit = require("p-limit");

class DownloadJob {
    constructor(song) {
        this.song = song;
    }

    async downloadSong() {
        //First make sure the song file doesn't already exist
        let alreadyExists = await util.checkFileOrDirExistence(this.song.getFilePath());

        return new Promise((resolve, reject) => {
            if (alreadyExists) {
                console.log(`*${this.song.getName()} - ${this.song.getGameName()} is already downloaded!*`);
                resolve();
            } else {
                downloadSong(this.song)
                    .then(() => trimSong(this.song))
                    .then(() => deleteTemp(this.song))
                    .then(() => {
                        console.log(`*Completed download of ${this.song.getName()} - ${this.song.getGameName()}!*`);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }
}

class DownloadJobQueue {
    constructor(gameManager, name) {
        this.name = name; //The name of the function that spawned this job
        this.queue = [];
        this.limiter = pLimit(2);
        this.gameManager = gameManager;
    }

    execute(destination) {
        return new Promise(async (resolve, reject) => {
            this.gameManager.setDestination(destination);
            this.gameManager.queueDownloads(this);

            await Promise.all(this.queue)
                .then(() => {
                    console.log("Downloads complete!");
                    resolve();
                });
        });
    }
}

//Start and end times are in hh:mm:ss format
function downloadSong(song) {
    return new Promise(async (resolve, reject) => {
        console.log(`Downloading audio for "${song.getName()} - ${song.getGameName()}"...`);

        await childProcess.execFile('./util/downloadutils/youtube-dl.exe',
            ['-o', `${song.getFilePath()} (temp)`,
                '--config-location', './util/downloadutils/ytdlconfig.txt',
                song.getYTLink()],
            ((error, stdout, stderr) => {
                if (error) {
                    console.error("An error occurred while trying to download a song.");
                    reject(error);
                } else {
                    console.log(stdout);
                    console.log(`Downloaded audio for "${song.getName()} - ${song.getGameName()}"!`);
                    resolve();
                }
            }));
    });
}


function trimSong(song) {
    return new Promise(resolve => {
        console.log(`Trimming audio for "${song.getName()} - ${song.getGameName()}"...`);

        childProcess.execFile('./util/downloadutils/ffmpeg.exe',
            ['-hide_banner', '-y',
                '-loglevel', 'panic',
                '-i', `${song.getFilePath()} (temp)`,
                '-ss', song.startTime, '-t', song.duration,
                '-c:v', 'copy', '-c:a', 'libmp3lame',
                '-q:a', '2', `${song.getFilePath()}`],
            () => {
            console.log(`Trimmed audio for "${song.getName()} - ${song.getGameName()}"!`);
            resolve();
        });
    });
}


function deleteTemp(song) {
    return new Promise(resolve => {
        console.log(`Deleting temporary file for "${song.getName()} - ${song.getGameName()}"...`);
        fs.unlink(`${song.getFilePath()} (temp)`, resolve);
    });
}

module.exports = {
    DownloadJob,
    DownloadJobQueue,
};