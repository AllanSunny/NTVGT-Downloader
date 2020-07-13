function setDestinations(games, root) {
    for (let game of games) {
        game.setFilePaths(root);
    }
}


module.exports = {
    setDestinations,
};