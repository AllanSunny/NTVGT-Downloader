# NTVGT Downloader
The NTVGT Downloader is a utility that aids in setup for the Name that Video Game Tune™ (NTVGT) Jeopardy-style game, run by the RIT Game Symphony Orchestra. Each game round comprises of multiple categories, each containing video game songs. The goal of the players is to guess the title of a song and/or the name of the game it originated from.


## Table of Contents
* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Example Run](#example-run)
* [Planned Features](#planned-features)
* [Contact](#contact)

## About the Project
This program was made in order to streamline the process of downloading game audio clips from Youtube, trimming them down to short segments, and organizing the resulting files. 

Doing this tedious process previously took multiple hours for sessions containing upwards of 3 rounds with 30 songs each. The NTVGT Downloader shaved this time down to less than an hour!

This project was created using [Node.js](https://nodejs.org/) v12.13.1. _Currently, it is only designed for use on Windows devices._


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
      * A start time is required if an end time is desired.
* get: Retrieve an item from the next layer down in the data structure.
  * Usage: ``get;<name/title or ID>``
* previous: Retrieve the item that this current data is stored in (the previous layer of the data structure).
  * Usage: ``previous``
* remove: Remove an item from the next layer down in the data structure.
  * Usage: ``remove;<name/title or ID>``
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
add;New Category
get;New Category
add;accumula town;pokemon B/W;https://www.youtube.com/watch?v=dTnZqMpWttY;0:00;40
get;0
previous;
get;Accumula town
download;C:\Users\[your username]\Documents
exit
```


## Planned Features
Currently, the program is in its minimum viable product state. In the future, these features may be added.
* Automatically downloading executable dependencies such as ``youtube-dl.exe`` and ``ffmpeg.exe``
* Saving and loading existing data
* A user interface to view and interact with the data
*	Presentation of game and audio content using created data
*	A live buzzer system to integrate with the presentation of the game content


## Contact
Allan Sun • allansun@live.com • [LinkedIn](https://linkedin.com/in/allan-sunny)
