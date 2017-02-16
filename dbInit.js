let SQLite = require('sqlite3');
let fs = require('fs');

// Delete an already existing database
if(fs.existsSync){fs.unlink('mystery-races.sqlite', (err) => {if(err) throw err});}

// Open the JSON file for reading
fs.readFile('organised-formatted-games-list.json', 'utf8', (err, data) => {
    // Hopefully nothing goes wrong
    if(err){throw err;}

    // Transform the JSON into a JavaScript object
    let randomGames = JSON.parse(data);

    // Open / Create the database
    let db = new SQLite.Database('mystery-races.sqlite');

    // Create the random-games table
    db.run("CREATE TABLE unofficial(name TEXT, genre TEXT, region TEXT, url TEXT, console TEXT, goals TEXT, pastebin TEXT)",
        (err) => {if(err) throw err});

    setTimeout(() => {
        // Loop over the games in the unofficial JSON file
        randomGames.forEach((game) => {
            console.log("Inserting "+game.title);
            let insert = "INSERT INTO unofficial (name, genre, region, url, console) VALUES (?,?,?,?,?)";
            db.run(insert, [
                game.title,
                JSON.stringify(game.genre),
                JSON.stringify(game.region),
                JSON.stringify(game.url),
                JSON.stringify(game.console)
            ], (err) => {
                if(err) throw err});
        });
    }, 3000);
});