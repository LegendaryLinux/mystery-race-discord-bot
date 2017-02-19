let testCommand = "!command genre=platformer region=usa console=snes hasnotes hasgoal hasestimate";
let altCommand = "!command genre=platformer region=usa console=snes";

let officialCommand = testCommand.match(/^!randommt\s/);
let unofficialCommand = testCommand.match(/^!random\s/);
let genreSearch = testCommand.match(/genre=.*\s/);
let regionSearch = testCommand.match(/region=.*\s/);
let consoleSearch = testCommand.match(/console=.*\s/);
let mandateNotes = testCommand.match(/hasnotes/);
let mandateGoal = testCommand.match(/hasgoal/);
let mandateEstimate = testCommand.match(/hasestimate/);

let filter = testCommand.split('console=')[1];
filter = filter.indexOf(' ') > 0 ? filter.substring(0,filter.indexOf(' ')) : filter;

console.log(filter);

