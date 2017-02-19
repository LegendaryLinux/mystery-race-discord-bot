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

        // Filter variables all start null
        this.genreFilter = this.regionFilter = this.consoleFilter = null;

        // Boolean filters all start false
        this.hasNotes = this.hasGoal = this.hasEstimate = false;

        // Handle the message given to the class
        this.handleMessage();
    }

    parseFilters() {
        let temp = null;
        
        // Check for variable filters
        if (this.message.match(/genre=.*\s/)) { // Genre
            temp = testCommand.split('genre=')[1];
            this.genreFilter = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }
        if (this.message.match(/region=.*\s/)) { // Region
            temp = testCommand.split('region=')[1];
            this.regionFilter = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }
        if (this.message.match(/console=.*\s/)) { // Console
            temp = testCommand.split('console=')[1];
            this.consoleFilter = temp.indexOf(' ') > 0 ? temp.substring(0,temp.indexOf(' ')) : temp;
        }

        // Check for boolean filters
        if (this.message.match(/hasnotes/)) this.hasNotes = true; // Notes
        if (this.message.match(/hasgoal/)) this.hasGoal = true; // Goal
        if (this.message.match(/hasestimate/)) this.hasEstimate = true; // Estimate
    }

    handleDynamicCommands(){
        if(!this.command) return;
        this.parseFilters();

        let chooser = new GameChooser(this.discordChannel);

        switch(this.command){
            case 'random':
                chooser.chooseRandomGame(false);
                break;
            case 'randommt':
                chooser.chooseRandomGame(true);
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

        let filename = 'bot' + this.command.charAt(0).toUpperCase() + this.command.slice(1) + '.txt';
        let filepath = __dirname+'/../publicFiles/'+filename;
        if(fs.existsSync(filepath)){
            fs.readFile(filepath,'utf8',(err, data) => {
                if(err) throw err;
                console.log("Responding to request for " + command + "command.");
                this.discordChannel.sendMessage('```'+data+'```');
            });
            return;
        }

        // The command must be dynamic if valid
        this.handleDynamicCommands();
    }
}

module.exports = MessageHandler;