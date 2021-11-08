const core = require("@actions/core");
const { exec } = require("child_process");
const fs = require("fs");

// Create the corde config file
// Run corde --validate to check we have everything we need or fail fast

class CordeConfig {
  constructor(
    cordeBotToken,
    botTestID,
    botToken,
    guildID,
    channelID,
    botPrefix,
    testMatches,
    timeout
  ) {
    this.cordeBotToken = cordeBotToken;
    this.botTestID = botTestID;
    this.botToken = botToken;
    this.guildID = guildID;
    this.channelID = channelID;
    this.botPrefix = botPrefix;
    this.testMatches = testMatches;
    this.timeout = timeout;
  }
}

function generateConfig() {
  const cordeBotToken = core.getInput("cordeBotToken");
  const botTestID = core.getInput("botTestID");
  const botToken = core.getInput("botToken");
  const guildID = core.getInput("guildID");
  const channelID = core.getInput("channelID");
  const botPrefix = core.getInput("botPrefix");
  const testMatches = core.getInput("testMatches");
  console.log(`"${testMatches}"`);
  const timeout = core.getInput("timeout");
  const config = new CordeConfig(
    cordeBotToken,
    botTestID,
    botToken,
    guildID,
    channelID,
    botPrefix,
    testMatches,
    timeout
  );
  return JSON.stringify(config);
}

try {
  const config = generateConfig();
  fs.writeFile("corde.config.json", config, (err) => {
    if (err) throw err;

    exec("npm test", (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
        throw err;
      }

      console.log(stdout);
      core.setOutput("passed", true);
    });
  });
} catch (error) {
  core.setFailed(error);
}
