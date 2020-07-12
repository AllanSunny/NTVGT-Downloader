function setDestinations(games, root) {
    for (let game of games) {
        game.setFilePaths(root);
        //Add setDestination method to game, category, song
        //Build directory structure starting from each game
        //(On each one, assign filePath as a field)
    }
}


module.exports = {
    setDestinations,
};