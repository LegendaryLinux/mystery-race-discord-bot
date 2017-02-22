let mysql = require('mysql');
let fs = require('fs');

class GameChooser{
    constructor(discordChannel){
        // We need a discord channel to reply to
        if(!discordChannel)
            throw "Attempted to create GameChooser class (object) without specifying discordChannel";
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

    chooseRandomGame(official, filters){
        let logType = official ? "official" : "unofficial";
        console.log("Responding to request for " + logType + "game with filters: " + JSON.stringify(filters));

        // Default to official races
        let useOfficial = typeof(official) === 'undefined' ? true : official;

        // Assert official is a boolean
        if(typeof(useOfficial) !== 'boolean')
            throw "Invalid parameter passed as first argument of chooseRandomGame. Expected boolean, " +
            "received " + typeof(useOfficial);

        // Default to no filters
        let filterObj = typeof(filters) === 'undefined' ? {} : filters;

        // Assert filters is an object
        if(typeof(filterObj) !== 'object')
            throw "Invalid parameter passed as second argument of chooseRandomGame. Expected null or object, " +
            "received " + typeof(filterObj);

        // Make decisions about how to form the SQL query
        let tableSql = useOfficial ?
            "FROM mystery_races.official\n" : // Official races table
            "FROM mystery_races.unofficial\n"; // Unofficial races table

        // Variables to hold variable sql data
        let genreSql = ''; let regionSql = ''; let consoleSql = '';
        let notesSql = ''; let goalSql = ''; let estimateSql = '';
        let sqlData = [];
        
        // Set up sql filters
        if(typeof(filters.genre) !== 'undefined' && filters.genre){
            genreSql = "AND LOWER(genre) = LOWER(?)\n";
            sqlData.push(filters.genre);
        }
        if(typeof(filters.region) !== 'undefined' && filters.region){
            regionSql = "AND LOWER(region) = LOWER(?)\n";
            sqlData.push(filters.region);
        }
        if(typeof(filters.console) !== 'undefined' && filters.console){
            consoleSql = "AND LOWER(console) = LOWER(?)\n";
            sqlData.push(filters.console);
        }
        if(typeof(filters.hasNotes) !== 'undefined' && filters.hasNotes)
            notesSql = "AND notes IS NOT NULL\n";
        if(typeof(filters.hasGoal) !== 'undefined' && filters.hasGoal)
            goalSql = "AND goal IS NOT NULL\n";
        if(typeof(filters.hasEstimate) !== 'undefined' && filters.hasEstimate)
            estimateSql = "AND estimate IS NOT NULL\n";
        
        // Stitch together the query
        let sql = "SELECT *\n" +
            tableSql +
            "WHERE ID\n" +
            genreSql +
            regionSql +
            consoleSql +
            notesSql +
            goalSql +
            estimateSql +
            "ORDER BY RAND()\n" +
            "LIMIT 1";

        // Performing a query implicitly established a connection to the database using the database connection
        // object created in the constructor
        this.db.query(sql, sqlData, (err, results, fields) => {
            if(err) throw err;

            // Make sure we actually find a game
            if(typeof(results[0]) === 'undefined' || !results[0]){
                console.log("Unable to find a game matching request.");
                this.discordChannel.sendMessage("```Sorry, I don't know of any games like the one you asked for.```");
                return;
            }

            // We can use results[0] here because it is the first of only one result.
            // If there were more than one results, we would need to loop over the results array.
            let game = results[0];

            // Use friendly output in case of null values
            let genre = game.genre ? game.genre : "Unknown";
            let region = game.region ? game.region : "Unknown";
            let estimate = game.estimate ? game.estimate : "None";
            let notes = game.notes ? game.notes : "None";
            let goal = game.goal ? game.goal : "Unknown";

            // Send a nicely formatted response back to the specified channel
            let response = "```\n" +
                "Game:     " + game.title + "\n" +
                "Goal:     " + goal + "\n" +
                "Console:  " + game.console + "\n"+
                "Genre:    " + genre + "\n" +
                "Region:   " + region + "\n" +
                "Download: " + game.url + "\n" +
                "Estimate: " + estimate + "\n" +
                "Notes:    " + notes + "\n" +
                "```";
            this.discordChannel.sendMessage(response);
            console.log("Responded with game: " + game.title);
        });

        // Disconnect from the database. The connection was implicitly established above
        this.db.end((err) => {if(err) throw err;});
    }
}

module.exports = GameChooser;