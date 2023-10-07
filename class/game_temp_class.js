class gameTempClass {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.execFile = new Array;
    }
    
    getName() {
        return this.name;
    }

    getPath() {
        return this.path;
    }

    pushExecFile(path) {
        this.execFile.push(path);
    }

    getExecFileArray() {
        return this.execFile;
    }

    getExecFileLength() {
        return this.execFile.length;
    }
}

module.exports = {
    gameTempClass
}