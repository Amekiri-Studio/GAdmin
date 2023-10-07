const fs = require('fs').promises;
const path = require('path');
const { checkFileExecType } = require('./filetype/executable');
const os = require('os');

/**
 * 广度遍历目录
 * @param {string} rootDir 欲扫描的根目录
 * @param {Function} callback 返回文件路径、名称的回调函数
 * @param {Function} onError 发生错误的时候的回调函数
 * @param {Function} onComplete 完成时的回调函数
 * @param {Object} option 附加选项
 */
async function walkDirBFS(rootDir, callback, onError, onComplete, option = {}) {
    const queue = [rootDir];

    async function processQueue() {
        while (queue.length > 0) {
			const currentDir = queue.shift();
			const files = await fs.readdir(currentDir);

			try {
				for (const file of files) {
					const filePath = path.join(currentDir, file);
					const stat = await fs.lstat(filePath);
					// const isDirectory = (await fs.lstat(filePath)).isDirectory();
					// const isSymbolicLink = (await fs.lstat(filePath)).isSymbolicLink();
					// const isFile = (await fs.lstat(filePath)).isFile();
					const isDirectory = stat.isDirectory();
					const isSymbolicLink = stat.isSymbolicLink();
					const isFile = stat.isFile();
	
					if (isSymbolicLink) {
						continue;
					} else if (isDirectory) {
						callback(filePath, isDirectory);
						queue.push(filePath);
					} else if (isFile) {
						if (option.checkExec) {
							let executable = await checkFileExecType(filePath);
							callback(filePath, false, executable);
						}
						else {
							callback(filePath, false);
						}
						
					}
				}
			} catch (error) {
				// console.error(`遍历目录时发生错误: ${error}`);
				onError(error);
			}
		}
    }

    await processQueue();
	onComplete("Scan finished");
}

/***
 * 扫描子目录（排除文件）
 * @param {string} rootDir 欲扫描的根目录
 * @param {Function} callback 回调函数
 * @param {Function} onError  错误时候的回调函数
 * @param {Function} onComplete 完成时候的回调函数
 */
async function readSubPath(rootDir, callback, onError, onComplete) {
	try {
		const files = await fs.readdir(rootDir);
		for(const file of files) {
			const isDirectory = (await fs.lstat(path.join(rootDir, file))).isDirectory();
			if (isDirectory) {
				callback(file);
			}
		}
	} catch (error) {
		onError(error);
	} finally {
		onComplete("Folder Scan finished");
	}
}

/**
 * 获取完整的配置文件目录（一般在~/.local/share/GAdmin）
 * @param {string} name 
 * @returns 
 */
function getDefaultUserPath(name) {
	if (!name) {
		return path.join(os.homedir(), ".local", "share", "GAdmin");
	}
	return path.join(os.homedir(), ".local", "share", "GAdmin", name);
}

module.exports = {
	walkDirBFS,
	readSubPath,
	getDefaultUserPath
}