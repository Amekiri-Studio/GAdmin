const mime = require('mime');
const path = require('path');
const { petype } = require('../../enum/petype');
const { scriptype } = require('../../enum/scriptype');

function getFileMimeType(filePath) {
    return mime.getType(filePath) || 'unknown';
}

function getFileType(filePath) {
    const extname = path.extname(filePath).toLowerCase();

    switch (extname) {
        case '.jpg':
        case '.jpeg':
        case '.png':
            return 'image';
        case '.pdf':
            return 'pdf';
        // 添加更多文件类型的判断
        default:
            return 'unknown';
    }
}

function checkIsPExe(filePath) {
    const extname = path.extname(filePath).toLowerCase();

    switch (extname) {
        case '.dll':
            return petype.dll
        case '.sys':
            return petype.sys
        case '.ocx':
            return petype.ocx
        case '.obj':
            return petype.obj;
        case '.exe':
            return petype.exe;
        case '.com':
            return petype.com;
        default:
            return petype.other;
    }
}

/**
 * 通过扩展名判断是否为共享对象(Shared Object)
 * @param {string} filePath 文件名或文件路径
 * @returns 如果真则是共享对象，反之不是
 */
function checkIsSharedObjectByExtName(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    if (extname === '.so') {
        return true;
    }
    const regex = /(.+)\.so\.\d+/;
    const match = filePath.match(regex);
    if (match) {
        return true;
    }
    else {
        return false;
    }
}

function checkIsShellOrBatchFile(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    switch (extname) {
        case '.bat':
        case '.cmd':
            return scriptype.batch;
        case '.sh':
            return scriptype.shell;
        default:
            return scriptype.other;
    }
}

module.exports = {
    getFileMimeType,
    getFileType,
    checkIsPExe,
    checkIsSharedObjectByExtName,
    checkIsShellOrBatchFile
}