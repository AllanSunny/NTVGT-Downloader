# NTVGT Downloader
The NTVGT Downloader is a utility that aids in setup for the Name that Video Game Tune™ (NTVGT) Jeopardy-style game, run by the RIT Game Symphony Orchestra. Each game round comprises of multiple categories, each containing video game songs. The goal of the players is to guess the title of a song and/or the name of the game it originated from.


## Table of Contents


## About the Project
This program was made in order to streamline the process of downloading game audio clips from Youtube, trimming them down to short segments, and organizing the resulting files. 

Doing this tedious process previously took multiple hours for sessions containing upwards of 3 rounds with 30 songs each. The NTVGT Downloader shaved this time down to less than an hour!

This project was created using [Node.js](https://nodejs.org/) v12.13.1. Currently, it is only designed for use on Windows devices.


## Getting Started
The program is still a work in progress, so no builds are available yet. Follow these steps to get a local copy of the code.

### Prerequisites
* Use **npm** to download dependencies for the project.
```sh
npm install npm@latest -g
```
* Install a local copy of [Youtube-dl](http://ytdl-org.github.io/youtube-dl/).
* Install a local copy of [FFMPEG](https://ffmpeg.org/).

### Installation
1. Clone a copy of the repository.
```sh
git clone https://github.com/AllanSunny/NTVGT-Downloader.git
```
2. Install all npm packages.
```sh
npm install
```
3. Place the ``youtube-dl.exe`` file in ``util/downloadutils``.
4. Place the ``ffmpeg.exe`` file in ``util/downloadutils``.


## Usage
