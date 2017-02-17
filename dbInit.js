let fs = require('fs');
let mysql = require('mysql');

// Read and save the database connection info into an object
fs.readFile('db-creds.json', 'utf8', (err, data) => {
    if(err) throw err;
    let dbInfo = JSON.parse(data);

    // Instantiate a database handle
    let db = new mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.user,
        password: dbInfo.pass,
        database: dbInfo.dbname
    });

    // Read and save the games list into an object
    fs.readFile('organised-formatted-games-list.json', 'utf8', (err, data) => {
        if(err){throw err;}
        let randomGames = JSON.parse(data);

        randomGames.forEach((game) => {

        });
    });
});