let fs = require('fs');
let config = require(__dirname+'/../data/config.json');
let OfficialGames = require(__dirname+'/OfficialGames.js');
let UnofficialGames = require(__dirname+'/UnofficialGames.js');

class MessageHandler{
    constructor(message){
        this.message = message;

        // Static commands should match a filename with the prefix of `bot` in the /data directory.
        // For example - the static command `help` should correspond to the file /data/botHelp.txt
        this.staticCommands = ['help','disclaimer'];
        this.dynamicCommands = ['random','randommt'];
        this.prefix = config.prefix;

        this.handleMessage();
    }

    handleStaticCommands(){
        this.staticCommands.forEach((command) => {
            // Generate the regex for this static command
            let regex = '/^' + this.prefix + command + '\s/';
            if(this.message.content.match(regex)){
                let filename = 'bot' + command.charAt(0).toUpperCase() + command.slice(1) + '.txt';
                fs.readFile(__dirname+'/../data/'+filename,'utf8',(err, data) => {
                    if(err) throw err;
                    this.message.channel.sendMessage('```'+data+'```');
                });
            }
        });
    }

    handleDynamicCommands(){
        this.dynamicCommands.forEach((command) => {
            // Generate the regex for this dynamic command
            let regex = '/^' + this.prefix + command + '\s/';
            if(this.message.content.match(regex)){

            }
        });
    }

    handleMessage(){
        this.handleStaticCommands();
        this.handleDynamicCommands();
    }
}

module.exports = MessageHandler;