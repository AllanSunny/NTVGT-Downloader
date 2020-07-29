const youtubedl = require("youtube-dl");
const childProcess = require('child_process');
const fs = require("fs");
const util = require("./index");

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


//Start and end times are in hh:mm:ss format
function downloadSong(song) {
    return new Promise((resolve, reject) => {
        let video = youtubedl(song.ytLink, ['-f', 'm4a']);

        video.on('info', () => {
            console.log(`Downloading audio for "${song.getName()} - ${song.getGameName()}"...`);
            video.pipe(fs.createWriteStream(`${song.getFilePath()} (temp)`));
        });

        video.on('error', (error) => {
            console.error("An error occurred while trying to download a song.");
            reject(error);
        });
        video.on('end', () => {
            console.log(`Downloaded audio for "${song.getName()} - ${song.getGameName()}"!`);
            resolve();
        });
    });
}


function trimSong(song) {
    return new Promise(resolve => {
        console.log(`Trimming audio for "${song.getName()} - ${song.getGameName()}"...`);

        childProcess.execFile('./util/FFMPEG/ffmpeg.exe', ['-hide_banner', '-y', '-loglevel', 'panic',
                '-i', `${song.getFilePath()} (temp)`, '-ss', song.startTime, '-t', song.duration,
                '-c:v', 'copy', '-c:a', 'copy', `${song.getFilePath()}`],
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
};