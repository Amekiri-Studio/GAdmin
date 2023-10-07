const sqlite3 = require('sqlite3').verbose();
const config = require("../../config/sqlite.json");
const fs = require("fs");
const path = require("path");
const { getDefaultUserPath } = require('../../utils/path');
const pino = require('pino');

class GAdminSqlite {
    
    constructor() {
        const dbPath = getDefaultUserPath(config.database);
        this.logger = pino({
            prettyPrint: true,
            level: 'info'
        })

        if (!fs.existsSync(dbPath)) {
            // 如果数据库文件不存在，创建它
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.closeSync(fs.openSync(dbPath, 'w'));
            // console.log(`Created SQLite database at ${dbPath}`);
            this.logger.info(`Created SQLite database at ${dbPath}`);
        }

        let db;

        db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) {
                    throw err;
                }
                // console.log("connected to sqlite");
                this.logger.info('Connected to sqlite');
            }
        )


        this.db = db;
    }

    getConnection() {
        return this.db;
    }

    async beginTransaction() {
        return new Promise((resolve, reject) => {
            this.db.run("BEGIN TRANSACTION", err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    async rollbackTransaction() {
        return new Promise((resolve, reject) => {
            this.db.run("ROLLBACK TRANSACTION", err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    async commitTransaction() {
        return new Promise((resolve, reject) => {
            this.db.run("COMMIT TRANSACTION", err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close(err => {
                    if (err) {
                        reject(err);
                    }
    
                    resolve();
                });
            }
        });
    }
}


module.exports = {
    GAdminSqlite
}