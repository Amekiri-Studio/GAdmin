const fs = require('fs');
const {exectype} = require('../../enum/exectype');
const {elftype} = require('../../enum/elftype');

/**
 * 检查可执行文件格式
 * @param {string} path 文件路径
 */
async function checkFileExecType(path) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.alloc(4);
        fs.open(path, 'r', (err, fd) => {
            if (err) {
                reject(err);
            }
            fs.read(fd, buffer, 0, 4, 0, (err, bytesRead, buffer) => {
                if (err) {
                    reject(err);
                }
                const magicBytes = buffer.toString('hex');


                if (magicBytes.startsWith('4d5a')) {
                    resolve({
                        isExe: true,
                        type:exectype.pe
                    });
                }
                else if (magicBytes === '7f454c46') {
                    
                    getELFType(path).then(type => {
                        // console.log(type);
                        resolve({
                            isExe: true,
                            type: exectype.elf,
                            elftype: type
                        });
                    });
                    // resolve({
                    //     isExe: true,
                    //     type:exectype.elf
                    // });
                }
                else {
                    resolve({
                        isExe:false
                    })
                }

                fs.close(fd, (err) => {
                    if (err) {
                        console.error(`无法关闭文件: ${err}`);
                        reject(err);
                    }
                });
            });

        });
    })
}
/**
 * 检查ELF文件类型
 * @param {string} path 文件路径
 */
async function getELFType(path) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.alloc(64);
        fs.open(path, 'r', (err, fd) => {
            if (err) {
                reject(err);
            }
            fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buffer) => {
                if (err) {
                    reject(err);
                }
                const eType = buffer.readUInt16LE(16);
    
                switch (eType) {
                    case 2:
                        resolve(elftype.exec);
                        break;
                    case 3:
                        resolve(elftype.dyn);
                        break;
                    case 4:
                        resolve(elftype.core);
                        break;
                    default:
                        resolve(elftype.other);
                }

                fs.close(fd, (err) => {
                    if (err) {
                        console.error(`无法关闭文件: ${err}`);
                        reject(err);
                    }
                });
            })
        })
    })
}

module.exports = {
    checkFileExecType,
    getELFType
}