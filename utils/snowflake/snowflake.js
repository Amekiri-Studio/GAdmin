const path = require('path');
const { saveLastTimestamp, getConfigAndLastTimestamp } = require('./config');
const { getDefaultUserPath } = require('../path');
const config = require("../../config/snowflake.json");

/**
 * 雪花算法类
 */
class Snowflake {
    /**
     * @constructor
     * @param {bigint} epoch 开始的时间戳(唯一不可变，可保存到配置文件)
     * @param {bigint} dataCenterId 数据中心ID(唯一，可保存到配置文件)
     * @param {bigint} workerId 工作ID(唯一，可保存到配置文件)
     * @param {bigint} lastTimestamp 最后的时间戳(可通过配置文件读取)
     */
    constructor (epoch ,dataCenterId, workerId, lastTimestamp) {
        this.epoch = epoch;
        this.dataCenterId = dataCenterId;
        this.workerId = workerId;

        this.timestampBits = 41;
        this.dataCenterBits = 5;
        this.workerBits = 5;
        this.sequenceBits = 12;

        this.maxDataCenterId = BigInt(-1 ^ (-1 << this.dataCenterBits));
        this.maxWorkerId = BigInt(-1 ^ (-1 << this.workerBits));

        this.timestampShift = this.dataCenterBits + this.workerBits + this.sequenceBits;
        this.dataCenterShift = this.workerBits + this.sequenceBits;
        this.workerShift = this.sequenceBits;

        this.sequenceMask = BigInt(-1 ^ (-1 << this.sequenceBits));
        this.sequence = BigInt(0);

        // this.lastTimestamp = BigInt(-1);
        this.lastTimestamp = BigInt(lastTimestamp);

        if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
            throw new Error(`Data center ID must be between 0 and ${this.maxDataCenterId}`);
        }
      
        if (this.workerId > this.maxWorkerId || this.workerId < 0) {
            throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
        }

    }

    nextId(option = {}) {
        let timestamp = BigInt(this.timeGen());

        if (timestamp < this.lastTimestamp) {
            throw new Error("Clock is moving backwards. Refusing to generate ID.");
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + BigInt(1) & this.sequenceMask);
            if (this.sequence == BigInt(0)) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = BigInt(0);
        }

        this.lastTimestamp = timestamp;

        let _path = path.join(getDefaultUserPath(), config.lastTimestamp);
        saveLastTimestamp(_path ,this.lastTimestamp);

        const id = ((timestamp - BigInt(this.epoch)) << BigInt(this.timestampShift)) |
            (BigInt(this.dataCenterId) << BigInt(this.dataCenterShift)) |
            (BigInt(this.workerId) << BigInt(this.workerShift)) |
            this.sequence;

        return option.string ? id.toString() : id;
    }

    timeGen() {
        return Date.now();
    }

    tilNextMillis(lastTimestamp) {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }

    /**
     * 创建一个雪花ID实例（读取配置文件，异步函数）
     * @param {Object} option 
     * @returns 
     */
    static async createSnowflakeObject() {
        let result = await getConfigAndLastTimestamp();
        let config = result[0];
        let timestamp = result[1];
        let snowflake = new Snowflake(config.epoch, config.dataCenterId, config.workerId, timestamp);
        return snowflake;
    }
}

module.exports = {
    Snowflake
}