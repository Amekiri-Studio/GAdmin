const { LocalGameSqlite } = require("../database/local");
const { processOutput } = require("./output");

function searchGame(keyword, option = {}) {
    let localGame = new LocalGameSqlite();
    localGame.searchGame(keyword).then(rows => {
        if (option.json) {
            console.log(rows);
        } else {
            processOutput(rows, option);
        }
    }).catch(err => {
        console.error(err);
    });
    localGame.close();
}

module.exports = {
    searchGame
}