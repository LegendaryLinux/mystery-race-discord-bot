let testCommand = "!command genre=platformer region=usa console=snes hasnotes hasgoal hasestimate";

let officialCommand = testCommand.match(/^!randommt\s/);
let unofficialCommand = testCommand.match(/^!random\s/);
let genreSearch = testCommand.match(/genre=.*\s/);
let regionSearch = testCommand.match(/region=.*\s/);
let consoleSearch = testCommand.match(/console=.*\s/);
let mandateNotes = testCommand.match(/hasnotes/);
let mandateGoal = testCommand.match(/hasgoal/);
let mandateEstimate = testCommand.match(/hasestimate/);