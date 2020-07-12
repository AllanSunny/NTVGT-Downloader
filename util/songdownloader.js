const youtubedl = require("youtube-dl");
const childProcess = require('child_process');
const fs = require("fs");

//Start and end times are in hh:mm:ss format
function downloadSong(song) {
    return new Promise((resolve, reject) => {
        console.log(song.getFilePath());

        let video = youtubedl(song.ytLink, ['-f', 'm4a']);

        video.on('info', function (info) {
            console.log(`Downloading audio for ${song.getName()} - ${song.getGameName()}...`);

            let tempDownloadPath = `${song.getFilePath()} (temp)`;
            video.pipe(fs.createWriteStream(tempDownloadPath));
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

        let tempDownloadPath = `${song.getFilePath()} (temp)`;
        childProcess.execFile('./util/FFMPEG/ffmpeg.exe', ['-hide_banner', '-y', '-loglevel', 'panic',
                '-i', tempDownloadPath, '-ss', song.startTime, '-t', song.duration,
                '-c:v', 'copy', '-c:a', 'copy', song.getFilePath()],
            () => {
            console.log(`Trimmed audio for ${song.getName()} - ${song.getGameName()}!`);
            resolve();
        });
    });
}


function deleteTemp(song) {
    return new Promise(resolve => {
        console.log(`Deleting temporary file for ${song.getName()} - ${song.getGameName()}...`);

        let tempDownloadPath = `${song.getFilePath()} (temp)`;
        fs.unlink(tempDownloadPath, resolve);
    });
}

    //TODO: Do a check somewhere to make sure output file doesn't already exist??


module.exports = {
    downloadSong,
    trimSong,
    deleteTemp,
};