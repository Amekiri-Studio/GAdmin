const { gameInfoType } = require("../enum/gameinfotype");
const { GAdminSqlite } = require("./sqlite/sqlite");

class LocalGameSqlite extends GAdminSqlite {
    constructor() {
        super();
    }

    async getConnection() {
        return super.getConnection();
    }

    async createTable() {
        
        return new Promise((resolve, reject) => {
            // let db = super.getConnection();
            this.db.run(`CREATE TABLE IF NOT EXISTS local_game(id BIGINT, name, path, exe_file, type, env, params)`, 
                err => {
                    if (err) {
                        reject(err);
                    }

                    resolve();
            });
        });
    }

    async addGame(id ,name, path, exe_file, type, env, params) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT INTO local_game(id,name,path,exe_file,type,env,params)
                VALUES(?, ?, ?, ?, ?, ?, ?)
            `, [id ,name, path, exe_file, type, env, params], err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    async removeGame(params) {
        if (params.id) {
            return this.removeGameById(params.id);
        } else if (params.name) {
            return this.removeGameByName(params.name);
        } else {
            throw new Error(`Error: Parameters error!
            You should provide a JSON, such like:
            { id:GAME_ID }
            OR { name:GAME_NAME }`);
        }
    }

    async removeGameById(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`
            DELETE FROM local_game WHERE id=?
            `, [id], err => {
                if (err) {
                    reject(err);
                }

                resolve();
            })
        });
    }

    async removeGameByName(name) {
        return new Promise((resolve, reject) => {
            this.db.run(`
            DELETE FROM local_game WHERE name=?
            `, [name], err => {
                if (err) {
                    reject(err);
                }
    
                resolve();
            });
        });
    }

    async listGame(limit, offset) {
        let sql = `
        SELECT * FROM local_game
        `;

        const params = [];

        if (limit !== undefined && offset !== undefined) {
            sql += `
            LIMIT ? OFFSET ?
            `;
            params.push(limit, offset);
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async searchGame(name) {
        return new Promise((resolve, reject) => {
            this.db.all(`
            SELECT * FROM local_game WHERE name like ?
            `, [`%${name}%`], (err, rows) => {
                if (err) {
                    reject(err);
                }
    
                resolve(rows);
            });
        });
    }

    async getGameById(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`
            SELECT * FROM local_game WHERE id=?
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    async modifyGameInfo(type, keyword, content) {
        let sql = `UPDATE local_game SET ${type} = ? WHERE id = ? OR name LIKE ?`;
        let params = [content, keyword, `%${keyword}%`];

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, err => {
                if (err) {
                    reject(err);
                }

                resolve();
            })
        });
    }

    serialize(func) {
        this.db.serialize(func);
    }

    async close() {
        return await super.close();
    }
}

module.exports = {
    LocalGameSqlite
}