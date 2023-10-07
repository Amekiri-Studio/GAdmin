
const { LocalGameSqlite } = require("../database/local");
const { processOutput } = require('./output');

function listAllGame(option = {}) {
    let localGame = new LocalGameSqlite();
    localGame.listGame().then(rows => {
        processOutput(rows, option);
    }).catch(err => {
        console.error(err);
    })
    localGame.close();
}

function listGameByRange(limit, offset, option = {}) {
    let localGame = new LocalGameSqlite();
    localGame.listGame(limit, offset).then(rows => {
        processOutput(rows, option);
    }).catch(err => {
        console.error(err);
    });
    localGame.close();
}

module.exports = {
    listAllGame,
    listGameByRange
}