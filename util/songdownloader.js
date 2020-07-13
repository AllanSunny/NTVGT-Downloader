const youtubedl = require("youtube-dl");
const childProcess = require('child_process');
const fs = require("fs");

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
    downloadSong,
    trimSong,
    deleteTemp,
};