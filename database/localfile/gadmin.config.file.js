const fs = require('fs');
const path = require('path');
const config = require("../../config/localconfig.json");

async function createGAdminLocalConfig(directoryPath, id) {
    const _path = path.join(directoryPath, config.directoryPath);
    return new Promise((resolve, reject) => {
        fs.mkdir(_path, { recursive: true }, err => {
            if (err) {
                reject(err);
            }

            const filePath = path.join(_path, 'info.json');
            let infoObject = {
                id: id
            }
            fs.writeFile(filePath, JSON.stringify(infoObject), err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    });
}

module.exports = {
    createGAdminLocalConfig
}