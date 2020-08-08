const childProcess = require('child_process');
const fs = require("fs");
const util = require("./index");
const pLimit = require("p-limit");

class DownloadJob {
    constructor(song) {
        this.song = song;
        this.runningDownload = undefined;
        this.killed = false;
    }

    async execute() {
        //First make sure the song file doesn't already exist
        let alreadyExists = await util.checkFileOrDirExistence(this.song.getFilePath());

        return new Promise((resolve, reject) => {
            if (alreadyExists) {
                console.log(`*${this.song.getName()} - ${this.song.getGameName()} is already downloaded!*`);
                resolve();
            } else {
                downloadSong(this)
                    .then(() => processSong(this))
                    .then(() => deleteTemp(this))
                    .then(() => {
                        console.log(`*Completed download of "${this.song.getName()} - ${this.song.getGameName()}"!*`);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    killDownload() {
        this.killed = true;
        if (this.runningDownload) {
            this.runningDownload.kill();
        }
    }
}

//A "cancellable task"
class DownloadJobQueue {
    constructor(gameManager, limit) {
        this.queue = []; //The queue of download job execution promises to be fulfilled
        let concurrency;
        limit ? concurrency = limit : concurrency = 3;
        this.limiter = pLimit(concurrency);

        this.jobs = []; //Instances of DownloadJobs
        this.gameManager = gameManager;
        this.killed = false;
    }

    execute(destination) {
        return new Promise(async (resolve) => {
            this.gameManager.setDestination(destination);
            this.gameManager.queueDownloads(this);

            await Promise.all(this.queue)
                .then(() => {
                    if (this.killed) {
                        console.log("Download process aborted!");
                    } else {
                        console.log("Downloads complete!");
                    }
                    resolve();
                });
        });
    }

    killProcesses() {
        return new Promise((resolve) => {
            this.killed = true;
            for (let job of this.jobs) {
                job.killDownload();
            }
            resolve();
        });
    }

    cleanUp() {
        return new Promise((resolve) => {
            this.gameManager.cleanUpDownloads();
            resolve();
        });
    }
}

//Start and end times are in hh:mm:ss format
function downloadSong(job) {
    return new Promise(async (resolve, reject) => {
        console.log(`Downloading audio for "${job.song.getName()} - ${job.song.getGameName()}"...`);

        job.runningDownload = childProcess.execFile('./util/downloadutils/youtube-dl.exe',
            ['-o', `${job.song.getFilePath()} (temp)`,
                '--config-location', './util/downloadutils/ytdlconfig.txt',
                job.song.getYTLink()],
            (error, stdout, stderr) => {
                if (error && !job.killed) {
                    console.error("An error occurred while trying to download a song.");
                    reject(error);
                } else if (error && job.killed) {
                    reject(`The download for "${job.song.getName()} - ${job.song.getGameName()}" was aborted.`);
                } else {
                    console.log(stdout);
                    console.log(`Downloaded audio for "${job.song.getName()} - ${job.song.getGameName()}"!`);
                    job.runningDownload = undefined;
                    resolve();
                }
            });
    });
}

//Processing song is running it through FFMPEG- trim and convert to final mp3 format
function processSong(job) {
    return new Promise(resolve => {
        console.log(`Processing audio for "${job.song.getName()} - ${job.song.getGameName()}"...`);

        childProcess.execFile('./util/downloadutils/ffmpeg.exe',
            ['-hide_banner', '-y',
                '-loglevel', 'panic',
                '-i', `${job.song.getFilePath()} (temp)`,
                '-ss', job.song.getStartTime(), '-t', job.song.getDuration(),
                '-c:v', 'copy', '-c:a', 'libmp3lame',
                '-q:a', '2', `${job.song.getFilePath()}`],
            () => {
            console.log(`Processed audio for "${job.song.getName()} - ${job.song.getGameName()}"!`);
            resolve();
        });
    });
}


function deleteTemp(job) {
    return new Promise(resolve => {
        console.log(`Deleting temporary file for "${job.song.getName()} - ${job.song.getGameName()}"...`);
        fs.unlink(`${job.song.getFilePath()} (temp)`, resolve);
    });
}

module.exports = {
    DownloadJob,
    DownloadJobQueue,
};