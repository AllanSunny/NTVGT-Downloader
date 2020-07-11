const youtubedl = require("youtube-dl");
const childProcess = require('child_process');
const fs = require("fs");

//Start and end times are in hh:mm:ss format
function downloadSong(song) {
    return new Promise((resolve, reject) => {
        let video = youtubedl(song.ytLink, ['-f', 'm4a']);

        video.on('info', function (info) {
            console.log(`Downloading audio for ${song.getName()} - ${song.getGameName()}...`);
            video.pipe(fs.createWriteStream('./test/temp'));
        });

        video.on('error', reject);
        video.on('end', () => {
            console.log(`Downloaded audio for ${song.getName()} - ${song.getGameName()}!`);
            resolve();
        });
    });
}


function trimSong(song) {
    return new Promise(resolve => {
        console.log(`Trimming audio for ${song.getName()} - ${song.getGameName()}...`);
        childProcess.execFile('./util/FFMPEG/ffmpeg.exe', ['-hide_banner', '-y', '-loglevel', 'panic', '-i', './test/temp',
            '-ss', song.startTime, '-t', song.duration, '-c:v', 'copy', '-c:a', 'copy', './test/FINAL.m4a'],
            () => {
            console.log(`Trimmed audio for ${song.getName()} - ${song.getGameName()}!`);
            resolve();
        });
    });
}


function deleteTemp(song) {
    return new Promise(resolve => {
        console.log(`Deleting temporary file of ${song.getName()} - ${song.getGameName()}...`);
        fs.unlink('./test/temp', resolve);
    });
}

    //TODO: Do a check somewhere to make sure output file doesn't already exist??


module.exports = {
    downloadSong,
    trimSong,
    deleteTemp,
};