const fs = require('fs');
const path = require('path');
const localConfigFile = require("../config/localconfig.json");
const { LocalGameSqlite } = require("../database/local");

function checkGame(directoryPath) {
    checkGameConfigLegal(directoryPath).then(() => {
        return readConfigFile(path.join(directoryPath, localConfigFile.directoryPath, localConfigFile));
    }).then(data => {
        let localGame = new LocalGameSqlite();
        return localGame.getGameById(data.id);
    }).then(res => {
        if (res.length <= 0) {
            console.error("No GAdmin config file");
        } else {
            
        }
    }).catch(err => {
        console.log("Config file does not exists, or no right to access, info: ",err);
    })
}

async function checkGameConfigLegal(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.access(path.join(directoryPath, localConfigFile.directoryPath, localConfigFile), fs.constants.F_OK, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        })
    });
}

async function readConfigFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

module.exports = {
    checkGame
}