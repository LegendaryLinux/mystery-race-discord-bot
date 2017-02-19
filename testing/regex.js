let testCommand = "!command genre=platformer region=usa console=snes hasnotes hasgoal hasestimate";

let officialCommand = testCommand.match(/^!randommt\s/);
let unofficialCommand = testCommand.match(/^!random\s/);
let genreSearch = testCommand.match(/genre=.*\s/);
let regionSearch = testCommand.match(/region=.*\s/);
let consoleSearch = testCommand.match(/console=.*\s/);
let mandateNotes = testCommand.match(/hasnotes/);
let mandateGoal = testCommand.match(/hasgoal/);
let mandateEstimate = testCommand.match(/hasestimate/);

let sub = testCommand.substring(0,testCommand.indexOf(" "));
if(sub.charAt(0) !== "!") console.log("Not a command.");
else console.log("Found command: "+sub.substring(1));