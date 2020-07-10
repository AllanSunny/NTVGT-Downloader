const youtubedl = require("youtube-dl");
const {execFileSync} = require('child_process');
const ffmpeg = require("js-ffmpeg");
const fs = require("fs");
const cutter = require("mp3-cutter");
const timeFormat = require("hh-mm-ss");


//Start and end times are in hh:mm:ss format
function downloadSong(ytLink, startTime, endTime, name) {
    //First download whole song into mp3 format
    let video = youtubedl(ytLink, ['-f', 'bestaudio', '--extract-audio', '--ffmpeg-location', './util/youtubedownloader/FFMPEG/ffmpeg.exe', '--audio-format', 'mp3']);

    video.on('info', function(info) {
        console.log(`Downloading ${name}...`);
    });

    video.pipe(fs.createWriteStream('./test/temp.mp3'));

    // cutter.cut({
    //     src: './test/temp.mp3',
    //     target: './test/FINAL.mp3',
    //     start: 0,
    //     end: 30
    // });
}

module.exports = {
    downloadSong,
    thing,
};