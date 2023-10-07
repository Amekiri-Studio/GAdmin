const { readSubPath } = require('../utils/path');
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const path = require('path');
const { scanStatus } = require('../enum/scan_message');
const { gameTempClass } = require('../class/game_temp_class');
const chalk = require("chalk");
const { UserInput } = require("./user_input");
const { LocalGameSqlite } = require('../database/local');
const { Snowflake } = require("../utils/snowflake/snowflake");
const { getGameTypeByExtname } = require('../utils/filetype/gametype');
const { createGAdminLocalConfig } = require('../database/localfile/gadmin.config.file');

// const readline = require('readline');

// const rl = readline.createInterface({
//   	input: process.stdin,
//   	output: process.stdout
// });

// function getUserInput() {
// 	return new Promise((resolve) => {
// 	  rl.question("Please ENTER code for exec file, or ENTER skip for skip :", (answer) => {
// 		resolve(answer.toLowerCase());
// 	  });
// 	});
//   }

function scanGameDefault (filePath) {
    let childrenPromise = [];
	let gameTempList = [];
	readSubPath(filePath, name => {
		let gameTemp = new gameTempClass(name, path.join(filePath, name));
		gameTempList.push(gameTemp);
		const worker = new Worker('./tasks/scan.js', { workerData:{name:name, path: path.join(filePath, name)}});
		worker.on('message', result => {
			if (result.code === scanStatus.error) {

			} 
			else {
				gameTemp.pushExecFile(result.path);
			}
		});
		childrenPromise.push(new Promise((resolve, reject) => {
		    worker.on('exit', code => {
			    console.log(`Worker "${name}" end, code ${code}`);
			    resolve();
	    	});
	    }));
	}, err => {
		console.error(err);
	}, message => {
		console.log(message);
		Promise.all(childrenPromise).then(() => {
			console.log('All workers are exited.');
			// console.log(gameTempList);
			processGames(gameTempList);
		});
	})
}

async function processGames(gameTempList) {
	inputObject = new UserInput();
	localGames = new LocalGameSqlite();
	let snowflake = await Snowflake.createSnowflakeObject();
	for (const gameTemp of gameTempList) {
		function _addGame(id) {
			let _id = snowflake.nextId({string:true});
			localGames.serialize(() => {
				localGames.createTable();
				localGames.addGame(
					snowflake.nextId({string:true}), 
					gameTemp.getName(), 
					gameTemp.getPath(), 
					gameTemp.getExecFileArray()[id],
					getGameTypeByExtname(gameTemp.getExecFileArray()[id]),
					"",
					"").then(() => {}).catch(err => console.log(err));
			});
			createGAdminLocalConfig(gameTemp.getPath(), _id).then(() => {

			}).catch(err => {
				console.log(err);
			});
		}
		if (gameTemp.getExecFileLength() > 20) {
			console.log(`Games ${chalk.bgBlue(gameTemp.getName())} have too many exec files, skip`);
		}
		else if (gameTemp.getExecFileLength() <= 0) {
			console.log(`Games ${chalk.bgBlue(gameTemp.getName())} have no exec files, skip`);
		}
		else if (gameTemp.getExecFileLength() == 1) {
			console.log(`Games ${chalk.bgBlue(gameTemp.getName())} have only one exec files, will automatic add to games library`);
			_addGame(0);
		}
		else {
			console.log(`Games ${chalk.bgBlue(gameTemp.getName())} have more one exec files, needly to select by user`);
			// console.log(gameTemp);
			let _i = 0;
			for (const execFile of gameTemp.getExecFileArray()) {
				console.log(`${chalk.greenBright(_i)} ${chalk.whiteBright(execFile)}`);
				_i++;
			}
			let answer = await inputObject.getUserInput("Please ENTER code for exec file, or ENTER skip for skip :");

			if (answer.toLowerCase() === "skip" || !answer) {
				console.log(`Game ${chalk.bgBlue(gameTemp.getName())} skipped`)
			} else {
				const _code = parseInt(answer);
				_addGame(_code);
			}
		}
	}
	localGames.close();
	inputObject.closeReadline();
}

async function scanSingleGame(gamePath) {
	let name = path.basename(gamePath);
	const worker = new Worker("./tasks/scan.js", {workerData:{name:name, path:gamePath}});
	let gameTemp = new gameTempClass(name, gamePath);

	worker.on('message', result => {
		if (result.code === scanStatus.error) {

		} 
		else {
			gameTemp.pushExecFile(result.path);
		}
	});

	worker.on("exit", code => {
		console.log(`Worker "${name}" end, code ${code}`);
		processGames([gameTemp]);
	});
}

module.exports = {
    scanGameDefault,
	scanSingleGame
}