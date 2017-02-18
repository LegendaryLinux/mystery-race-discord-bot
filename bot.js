let fs = require("fs");
let Discord = require("discord.js");
let config = require(__dirname+'/data/config.json');
let OfficialGames = require(__dirname+'/lib/OfficialGames.js');
let UnofficialGames = require(__dirname+'/lib/UnofficialGames.js');
let MessageHandler = require(__dirname+'/lib/MessageHandler.js');

// Login and connect to Discord
let client = new Discord.Client();
client.login(config.token);

// When the client receives a message, respond appropriately
client.on('message', (msg) => {
    // Bot is only allowed to function in the #blind-o-matic channel
    if(msg.channel.id !== '271770880399507456') return;

    // Handle the message
    new MessageHandler(msg);
});

// When the bot comes online, print a ready message to the console
client.on('ready', () => {
    console.log('Mystery-Bot is online and ready to accept commands.');
});