const path = require('path');
const { gametype } = require('../../enum/gametype');

function getGameTypeByExtname(exePath) {
    let extname = path.extname(exePath).toLowerCase();
    switch (extname) {
        case '.exe':
        case '.com':
            return gametype.wine;
        case '.cmd':
        case '.bat':
            return gametype.batch;
        case '.sh':
            return gametype.shell;
        default:
            return gametype.unix;
    }
}

module.exports = {
    getGameTypeByExtname
}