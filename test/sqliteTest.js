const { LocalGameSqlite } = require("../database/local");
const { Snowflake } = require("../utils/snowflake/snowflake");

async function main(){
    let snowflake = await Snowflake.createSnowflakeObject();
    let localGame = new LocalGameSqlite();
    localGame.addGame(
        snowflake.nextId({string:true}),
        "NAME",
        "PATH",
        "EXEC",
        "TYPE",
        "",
        ""
    )
}

main();