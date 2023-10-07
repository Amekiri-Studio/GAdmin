const { LocalGameSqlite } = require("../database/local");

function removeGame(content) {
    let localGame = new LocalGameSqlite();
    if (content.id) {
        localGame.removeGame({id: content.id});
    } else if(content.name) {
        localGame.removeGame({name: content.name});
    } else {
        throw new Error("Parameters Error! Please provide a parameter like as { id:_content } or { name:_content }");
    }
}

module.exports = {
    removeGame
}