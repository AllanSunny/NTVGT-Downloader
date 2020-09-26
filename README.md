# NTVGT Downloader
The NTVGT Downloader is a utility that aids in setup for the Name that Video Game Tune (NTVGT) Jeopardy-style game, run by the RIT Game Symphony Orchestra. Each game round comprises of multiple categories, each containing video game songs. The goal of the players is to guess the title of a song and/or the name of the game it originated from.


## Table of Contents
* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Example Run](#example-run)
* [Planned Features](#planned-features)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)


## About the Project
This program was made in order to streamline the process of downloading game audio clips from Youtube, trimming them down to short segments, and organizing the resulting files. 

Doing this tedious process previously took multiple hours for sessions containing upwards of 3 rounds with 30 songs each. The NTVGT Downloader shaved this time down to less than an hour!

This project was created using [Node.js](https://nodejs.org/) v12.13.1. _Currently, it is only functional on Windows devices._


## Getting Started
The program is still a work in progress, so no builds are available yet. Follow these steps to get a local copy of the code.

### Prerequisites
* Install **[Node.js](https://nodejs.org/)**.
* Download the latest version of **npm**.
```sh
npm install npm@latest -g
```
* Download a local copy of [Youtube-dl](http://ytdl-org.github.io/youtube-dl/).
* Download a local copy of [FFMPEG](https://ffmpeg.org/).

### Installation
1. Navigate to the desired directory for the code to be stored, then clone a copy of the repository.
```sh
git clone https://github.com/AllanSunny/NTVGT-Downloader.git
```
2. Install all npm dependencies by running this command in the newly created directory.
```sh
npm install
```
3. Place the ``youtube-dl.exe`` file in the ``util/downloadutils`` folder.
4. Place the ``ffmpeg.exe`` file in the ``util/downloadutils`` folder.
5. Run the program by running this command in the main directory.
```sh
node index.js
```


## Usage
The program requires an internet connection for full functionality (in order to successfully download songs). It currently operates on a command line input/output system. __After each command execution, the current data being viewed is outputted.__ All usable commands are shown below with examples. 

* add: Add an item to the data structure. The arguments for this command varies with what is currently being viewed.
  * NTVGT session (the base): Create a new game round to be associated with the session.
    * Usage: ``add``
  * Game: Create a new category to be associated with the round.
    * Usage: ``add;<category name>``
  * Category: Create a new song to be associated with the category.
    * Usage: ``add;<song title>;<game of origin>;<youtube video link>;<video start time>;<video end time>``
      * Start and end times can be in **seconds** or the **hh:mm:ss** format.
      * Start and end times are both optional. The default start time is **0:00** and the default end time is **30 seconds from the start time**.
      * _A start time is required if an end time is desired._
* get: Retrieve an item from the next layer down in the data structure.
  * Usage: ``get;<name/title or ID>``
* previous: Retrieve the item that this current data is stored in (the previous layer of the data structure).
  * Usage: ``previous``
* remove: Remove an item from the next layer down in the data structure.
  * Usage: ``remove;<name/title or ID>``
    * _If the download command has previously completed during the same program run, existing directories associated with the removed data will also be removed._
* download: Download audio files for all currently created song data, creating any directories as necessary to match the data structure.
  * Usage: ``download;<root storage directory>;<concurrency limit>``
    * The concurrency limit is a limit on how many active downloads can be running at a given time. This argument is optional and will default to **3**.
    * _Enter_ ``stop`` _at any given time while this command is running to terminate all running and pending downloads._
* exit: Gracefully exit the program.
  * Usage: ``exit``
  
### Example Run
Below is an example sequence of commands to demonstrate a run of the program.
```sh
add
get;0
add;Example
get;0
add;accumula town;pokemon B/W;https://www.youtube.com/watch?v=dTnZqMpWttY;0:00;40
add;Enemy Approaching;Undertale;https://www.youtube.com/watch?v=JRU6GnETSN4
get;1
previous;
get;accumula Town
download;C:/Users/[your username]/Documents/NTVGT-Test-Run
exit
```


## Planned Features
* Automatically downloading executable dependencies such as ``youtube-dl.exe`` and ``ffmpeg.exe``
* Saving and loading existing data using csv files
  * Generating template csv files for data input
* A user interface to view and interact with the data
* Presentation of game and audio content using created data
* A live buzzer system to integrate with the presentation of the game content


## Contact
Allan Sun • allansun@live.com • [LinkedIn](https://linkedin.com/in/allan-sunny)


## Acknowledgements
* [Kaitlyn Tran](https://www.linkedin.com/in/kaitlyn-tran-/), for creating the idea of Name that Video Game Tune.
* [Node.js v12.x Documentation](https://nodejs.org/docs/latest-v12.x/api/)
