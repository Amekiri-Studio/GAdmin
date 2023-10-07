const chalk = require("chalk");

function processOutput(rows ,option = {}) {
    if (option.json) {
        console.log(rows);
    }
    else {
        console.log(`ID\t\tName`);
        for (const row of rows) {
            const idPadding = ' '.repeat(16 - row.id.toString().length); // 计算需要的填充空格
            console.log(`${chalk.bold(chalk.cyanBright(row.id))}${idPadding}${chalk.magenta(row.name)}`);
        }
    }
}

module.exports = {
    processOutput
}