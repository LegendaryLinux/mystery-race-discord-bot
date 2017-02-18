let fs = require("fs");
let Discord = require("discord.js");
let config = require(__dirname+'/data/config.json');
let OfficialGames = require(__dirname+'/lib/OfficialGames.js');
let UnofficialGames = require(__dirname+'/lib/UnofficialGames.js');

// Easily access the prefix for bot commands
let prefix = (config.prefix);

// Login and connect to Discord
let client = new Discord.Client();
client.login(config.token);

// WHen the client receives a message, respond appropriately
client.on('message', (msg) => {
    if(msg.channel.id === '271770880399507456'){
        switch (msg.content){
            // Ryan's unique message response
            case 'Ain\'t that right, Mystery Bot?':
                msg.channel.sendMessage(
                    msg.author.id === '74369891586543616' ? 'Sure is!' : 'I\'m sorry, but that is incorrect.'
                );
                break;

            // Display the bot disclaimer
            case prefix+'disclaimer':
                fs.readFile(__dirname+'/data/botDisclaimer.txt', 'utf8', (err, data) => {
                    if(err) throw err;
                    msg.channel.sendMessage("```"+data+"```");
                });
                break;

            // Choose a game from the official list
            case prefix+'randommt':
                let oGames = new OfficialGames(msg.channel);
                oGames.chooseRandomGame();
                break;

            // Choose a game from the unofficial list
            case prefix+'fullrandom':
                // Instantiate an instance of the UnofficialGames class
                let uGames = new UnofficialGames(msg.channel);
                uGames.chooseRandomGame();
                break;
            default:
                break;
        }
    }
});

// When the bot comes online, print a ready message to the console
client.on('ready', () => {
    console.log('Mystery-Bot is online and ready to accept commands.');
});