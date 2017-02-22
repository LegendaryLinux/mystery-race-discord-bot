let fs = require('fs');
let config = require(__dirname+'/../data/config.json');
let GameChooser = require(__dirname+'/GameChooser.js');

class MessageHandler{
    constructor(message){
        if(!message) throw "MessageHandler class instantiated without message argument.";
        this.discordChannel = message.channel;
        this.message = message.content;
        this.prefix = config.prefix;
        this.command = null;

        // Handle the message given to the class
        this.handleMessage();
    }

    handleDynamicCommands(){
        if(!this.command) return;

        let temp = null;
        let filterObject = {};

        // Check for variable filters
        if (this.message.match(/genre=.*\s?/)) { // Genre
            temp = this.message.split('genre=')[1];
            filterObject.genre = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }
        if (this.message.match(/region=.*\s?/)) { // Region
            temp = this.message.split('region=')[1];
            filterObject.region = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }
        if (this.message.match(/console=.*\s?/)) { // Console
            temp = this.message.split('console=')[1];
            filterObject.console = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }

        // Check for boolean filters
        if (this.message.match(/hasnotes/)) filterObject.hasNotes = true; // Notes
        if (this.message.match(/hasgoal/)) filterObject.hasGoal = true; // Goal
        if (this.message.match(/hasestimate/)) filterObject.hasEstimate = true; // Estimate

        let chooser = new GameChooser(this.discordChannel);

        switch(this.command){
            case 'random':
                chooser.chooseRandomGame(false, filterObject);
                break;
            case 'randommt':
                chooser.chooseRandomGame(true, filterObject);
                break;
            default: return;
        }
    }

    handleMessage(){
        let command = this.message.indexOf(' ') > 0 ?
            this.message.substring(0,this.message.indexOf(' ')) :
            this.message;

        if(command.charAt(0) !== config.prefix) return;
        this.command = command.substring(1);
        console.log("\nReceived command message: " + this.message);

        let filename = 'bot' + this.command.charAt(0).toUpperCase() + this.command.slice(1) + '.txt';
        let filepath = __dirname+'/../publicFiles/'+filename;
        if(fs.existsSync(filepath)){
            fs.readFile(filepath,'utf8',(err, data) => {
                if(err) throw err;
                console.log("Responding to request for " + command + " command.");
                this.discordChannel.sendMessage('```'+data+'```');
            });
            return;
        }

        // The command must be dynamic if valid
        this.handleDynamicCommands();
    }
}

module.exports = MessageHandler;