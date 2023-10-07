const { LocalGameSqlite } = require("../database/local");
const { gameInfoType } = require("../enum/gameinfotype");

function modifyInfo(keyword ,type, value) {
    let _type = judgeLegal(type);
    if (_type.toLowerCase() === 'unknown') {
        console.error('错误: 参数--type不合法');
        return;
    }
    let localGame = new LocalGameSqlite();
    localGame.serialize(() => {
        localGame.createTable();
        localGame.modifyGameInfo(type, keyword, value);
    });
}

function judgeLegal(type) {
    switch(type) {
        case gameInfoType.env:
            return 'env';
        case gameInfoType.exeFile:
            return 'exec_file'
        case gameInfoType.name:
            return 'name';
        case gameInfoType.params:
            return 'params';
        case gameInfoType.path:
            return 'path';
        case gameInfoType.type:
            return 'type';
        default:
            return 'unknown';
    }
}

module.exports = {
    modifyInfo
}