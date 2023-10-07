const { checkFileExecType } = require("../utils/filetype/executable");
const { walkDirBFS } = require("../utils/path");
const { scanStatus } = require("../enum/scan_message");
const pino = require('pino');
const chalk = require('chalk');
const { exectype } = require("../enum/exectype");
const { checkIsPExe, checkIsSharedObjectByExtName, checkIsShellOrBatchFile } = require("../utils/filetype/filetype");
const { petype } = require("../enum/petype");
const { elftype } = require("../enum/elftype");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { scriptype } = require("../enum/scriptype");
const { gametype } = require("../enum/gametype");

function scanGameExecFile(name, path) {
    const logger = pino({
        prettyPrint: true,
        level: 'info'
    });

    logger.info(`Scanning path:${chalk.bgBlue(name)}`);

    walkDirBFS(path, async (filePath, isDirectory, executable) => {
        if (isDirectory) {
            // console.log(`Dictionary:${filePath}`);
            logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('Directory')} "${filePath}"`));
        }
        else {
            if (executable.isExe) {
                // console.log(`Exec file:${filePath}`)
                if (executable.type === exectype.pe) {
                    let peType = checkIsPExe(filePath);
                    if (peType === petype.exe) {
                        logger.info(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('PE exec file')} "${filePath}"`));
                        parentPort.postMessage({code: scanStatus.success ,message:'Find exec file', path:filePath, type:gametype.wine});
                    }
                    else {
                        logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan(`PE ${peType} file`)} "${filePath}"`));
                    }
                }
                else if (executable.type === exectype.elf) {
                    if (executable.elftype === elftype.exec || executable.elftype === elftype.dyn) {
                        if (!checkIsSharedObjectByExtName(filePath)) {
                            logger.info(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('ELF exec file')} "${filePath}"`));
                            parentPort.postMessage({code: scanStatus.success ,message:'Find exec file', path:filePath, type:gametype.unix});
                        }
                        else {
                            logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan(`ELF ${executable.elftype} file`)} "${filePath}"`));
                        }
                    }
                    else {
                        logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan(`ELF ${executable.elftype} file`)} "${filePath}"`));
                    }
                }
                
            }
            else {
                switch (checkIsShellOrBatchFile(filePath)) {
                    case scriptype.batch:
                        logger.info(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan(`${scriptype.batch} file`)} "${filePath}"`));
                        parentPort.postMessage({code: scanStatus.success ,message:'Find exec file', path:filePath, type:gametype.batch});
                        break;
                    case scriptype.shell:
                        logger.info(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan(`${scriptype.shell} file`)} "${filePath}"`));
                        parentPort.postMessage({code: scanStatus.success ,message:'Find exec file', path:filePath, type:gametype.shell});
                        break;
                    default:
                        logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('Not exec file')} "${filePath}"`));
                        break;
                }
                // if (checkIsShellOrBatchFile(filePath)) {
                //     logger.info(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('SHELL exec file')} "${filePath}"`));
                //     parentPort.postMessage({code: scanStatus.success ,message:'Find exec file', path:filePath});
                // } else {
                //     logger.debug(chalk.white(chalk.bgBlue(name) + ` ${chalk.cyan('Not exec file')} "${filePath}"`));
                // }
                // console.log(`Not exec file:${filePath}`)
            }
        }
    }, err => {
        // console.error("ERROR:", err);
        logger.error(chalk.white(chalk.bgBlue(name) + `${err}`))
        console.log(err);
        parentPort.postMessage({code: scanStatus.error ,message:'error occupied', error:err});
    }, message => {
        // console.log(`\x1b[36m[${name}]\x1b[0m INFO:`, message);
        logger.info(chalk.white(chalk.bgBlue(name) + ` ${message}`));
        process.exit(0);
    }, {
        checkExec:true
    });
}

if (!isMainThread) {
    scanGameExecFile(workerData.name, workerData.path);
}

module.exports = {
    scanGameExecFile
}