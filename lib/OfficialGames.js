let mysql = require('mysql');
let fs = require('fs');

class OfficialGames{
    constructor(discordChannel){
        // We need a discord channel to reply to
        if(!discordChannel)
            throw "Attempted to create OfficialGames class (object) without specifying discordChannel";
        this.discordChannel = discordChannel;

        // Create a database connection object
        let connInfo = JSON.parse(fs.readFileSync(__dirname+'/../data/db-creds.json'));
        this.db = mysql.createConnection({
            host:       connInfo.host,
            user:       connInfo.user,
            password:   connInfo.pass,
            database:   connInfo.dbname,
        });
    }

    chooseRandomGame(regionChoice){
        // SQL in case the user requests a specific region
        let regionSql = regionChoice ? "WHERE LOWER(region) LIKE LOWER(CONCAT('%',?,'%'))" : "";

        let sql = "SELECT * " +
            "FROM mystery_races.official " +
            regionSql +
            "ORDER BY RAND() " +
            "LIMIT 1";
        // Performing a query implicitly established a connection to the database using the database connection
        // object created in the constructor
        this.db.query(sql, regionChoice ? [regionChoice] : [], (err, results, fields) => {
            if(err) throw err;

            // We can use results[0] here because it is the first of only one result.
            // If there were more than one results, we would need to loop over the results array.
            let game = results[0];

            // Use friendly output in case of null values
            let genre = game.genre ? game.genre : "Unknown";
            let region = game.region ? game.region : "Unknown";
            let estimate = game.estimate ? game.estimate : "None";
            let notes = game.notes ? game.notes : "None";

            // Send a nicely formatted response back to the specified channel
            let response = "```\n" +
                "Game:     " + game.title + "\n" +
                "Console:  " + game.console + "\n"+
                "Genre:    " + genre + "\n" +
                "Region:   " + region + "\n" +
                "Download: " + game.url + "\n" +
                "Estimate: " + estimate + "\n" +
                "Notes:    " + notes + "\n" +
                "```";
            this.discordChannel.sendMessage(response);
        });

        // Disconnect from the database. The connection was implicitly established above
        this.db.end((err) => {if(err) throw err;});
    }
}

module.exports = OfficialGames;