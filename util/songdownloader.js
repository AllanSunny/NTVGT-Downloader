const youtubedl = require("youtube-dl");
const {execFileSync} = require('child_process');
const fs = require("fs");

//Start and end times are in hh:mm:ss format
function downloadSong(ytLink, startTime, duration, name) {
    //Download audio
    let video = youtubedl(ytLink, ['-f', 'm4a']);
    video.on('info', function(info) {
        console.log(`Downloading ${name}...`);
        video.pipe(fs.createWriteStream('./test/temp'));
    });

    video.on('end', () => {
        //Trim audio
        console.log("Trimming audio...");
        execFileSync('./util/FFMPEG/ffmpeg.exe', ['-hide_banner', '-y', '-loglevel', 'panic', '-i', './test/temp',
            '-ss', startTime, '-t', duration, '-c:v', 'copy', '-c:a', 'copy', './test/FINAL.m4a']);

        //Delete temp
        console.log("Deleting temporary file...");
        fs.unlinkSync('./test/temp');

        console.log("Done!");
    });


    //TODO: Do a check somewhere to make sure output file doesn't already exist
}

module.exports = {
    downloadSong,
};