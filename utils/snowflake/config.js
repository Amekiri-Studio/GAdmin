const fs = require('fs');
const config = require("../../config/snowflake.json");
const path = require('path');
const os = require('os');
const { getDefaultUserPath } = require('../path');
const { rejects } = require('assert');
async function loadConfig(configFilePath) {
    try {
        const configData = await fs.promises.readFile(configFilePath, 'utf-8');
        return JSON.parse(configData);
    } catch (err) {
        throw err;
    }
}

async function saveConfig(config, configFilePath) {
    // const config = {
    //     epoch: this.epoch,
    //     dataCenterId: this.dataCenterId,
    //     workerId: this.workerId,
    //     lastTimestamp: this.lastTimestamp.toString(),
    // };

    try {
        // 创建文件夹（如果不存在）
        const configFolder = path.dirname(configFilePath);
        await fs.promises.mkdir(configFolder, { recursive: true });

        // 保存配置信息到文件
        await fs.promises.writeFile(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (err) {
        throw err;
    }
}

async function getLastTimestamp(lastTimestampPath) {
    try {
        const lastTimestampStr = await fs.promises.readFile(lastTimestampPath, 'utf-8');
        return lastTimestampStr;
    } catch (err) {
        throw err;
    }
}

async function saveLastTimestamp(lastTimestampPath ,timestamp) {
    try {
        await fs.promises.writeFile(lastTimestampPath, timestamp.toString(), 'utf-8');
    } catch (err) {
        throw err;
    }
}

async function getConfigAndLastTimestamp() {
    let configPath, timestampPath;
    configPath = getDefaultUserPath(config.config);
    timestampPath = getDefaultUserPath(config.lastTimestamp);
    
    const configFolder = getDefaultUserPath();
    await fs.promises.mkdir(configFolder, { recursive: true });

    let configPromise = new Promise((resolve, reject) => {
        loadConfig(configPath).then(result => {
            resolve(result);
        }).catch(err => {
            try {
                let defaultValue = {
                    epoch: Date.now(),
                    dataCenterId: 1,
                    workerId: 1
                }
                // fs.promises.writeFile(configPath, JSON.stringify(defaultValue), 'utf-8');
                saveConfig(defaultValue ,configPath);
                resolve(defaultValue);
            } catch (error) {
                reject(error);
            }
        });
    });
    let timestampPromise = new Promise((resolve, reject) => {
        getLastTimestamp(timestampPath).then(result => {
            try {
                resolve(BigInt(result));
            } catch (error) {
                reject(error);
            }
        }).catch(err => {
            resolve(BigInt(-1));
        });
    });

    try {
        let result = await Promise.all([configPromise, timestampPromise]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    loadConfig,
    saveConfig,
    getLastTimestamp,
    saveLastTimestamp,
    getConfigAndLastTimestamp
}