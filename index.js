const { AutoPoster } = require("topgg-autoposter");
const Melody = require("./src/melodyClient");
const bot = new Melody();

const poster = AutoPoster(bot.config.topgg, bot);

bot.start();

poster.on("posted", (stats) => {
  // ran when succesfully posted
  bot.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
});

module.exports = bot;
