let fs = require('fs');
let config = require(__dirname+'/../data/config.json');
let OfficialGames = require(__dirname+'/OfficialGames.js');
let UnofficialGames = require(__dirname+'/UnofficialGames.js');

class MessageHandler{
    constructor(message){
        if(!message) throw "MessageHandler class instantiated without message argument.";
        this.message = message;
        this.prefix = config.prefix;
        this.command = null;

        // Filter variables all start null
        this.genreFilter = this.regionFilter = this.consoleFilter = null;
        this.hasNotes = this.hasGoal = this.hasEstimate = null;

        // Handle the message given to the class
        this.handleMessage();
    }

    parseFilters() {
        // Check for variable filters
        if (this.message.match(/genre=.*\s/)) {

        }
        if (this.message.match(/region=.*\s/)) {

        }
        if (this.message.match(/console=.*\s/)) {

        }

        // Check for boolean filters
        if (this.message.match(/hasnotes/)) this.hasNotes = true;
        if (this.message.match(/hasgoal/)) this.hasGoal = true;
        if (this.message.match(/hasestimate/)) this.hasEstimate = true;
    }

    handleDynamicCommands(){
        if(!this.command) return;
        this.parseFilters();

        switch(this.command){

        }
    }

    handleMessage(){
        let command = this.message.substring(0,this.message.indexOf(" "));
        if(command.charAt(0) !== config.prefix) return;
        this.command = command.substring(1);

        let filename = 'bot' + this.command.charAt(0).toUpperCase() + this.command.slice(1) + '.txt';
        if(fs.existsSync(filename)){
            fs.readFile(__dirname+'/../publicFiles/'+filename,'utf8',(err, data) => {
                if(err) throw err;
                this.message.channel.sendMessage('```'+data+'```');
            });
            return;
        }

        // The command must be dynamic if valid
        this.handleDynamicCommands();
    }
}

module.exports = MessageHandler;