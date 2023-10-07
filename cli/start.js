const { exec, spawn } = require('child_process');
const { gametype } = require('../enum/gametype');
const { LocalGameSqlite } = require('../database/local');
const { processOutput } = require('./output');
const option = require('../config/child_process_buffer.json');

async function processStartGame(content, env, params, r_env, r_params) {
    let localGames = new LocalGameSqlite();
    let dataType = typeof content;
    let gameObj;
    if (dataType === 'number') {
        gameObj = await localGames.getGameById(content);
    } else {
        gameObj = await localGames.searchGame(content);
    }

    if (!gameObj) {
        return;
    } else {
        if (gameObj.length <= 0) {
            console.log("No game found");
            return;
        } else if (gameObj.length > 1) {
            console.log("Have more one games, please input more accurate name or input id");
            processOutput(gameObj);
            return;
        } else {
            let _params, _env;
            if (r_params) {
                _params = params;
            } else {
                _params = gameObj[0].params + ' ' + (params === undefined ? "" : params);
            }

            if (r_env) {
                _env = env;
            } else {
                _env = gameObj[0].env + ' ' + (env === undefined ? "" : env);
            }
            startGame(gameObj[0].type, gameObj[0].exe_file, _env, _params);
        }
    }
}

function startGame(type, execFile, env, params) {
    let shell = ``;
    switch (type) {
        case gametype.batch:
            shell = `${env} wine start '${execFile}' ${params}`;
            break;
        case gametype.wine:
            shell = `${env} wine '${execFile}' ${params}`;
            break;
        case gametype.proton:
            shell = `${env} proton '${execFile}' ${params}`;
            break;
        case gametype.shell:
            shell = `${env} sh '${execFile}' ${params}`;
            break;
        case gametype.unix:
            shell = `${env} ./'${execFile}' ${params}`;
            break;
        default:
            return;
    }
    console.log(shell);

    // exec(shell, option, (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log(stdout);

    //     console.log(stderr);
    // })
    let child = spawn(shell, {
        shell:true
    });

    child.stdout.on('data', (data) => {
        console.log(`stdout:${data}`);
    });

    child.stderr.on('data', data => {
        console.log(`stderr:${data}`);
    });

    child.on('close', code => {
        console.log(`Child process end, code ${code}`)
    });
}

module.exports = {
    startGame,
    processStartGame
}