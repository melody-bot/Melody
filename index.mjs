import { AutoPoster } from "topgg-autoposter";
import Melody from "./src/melodyClient.js";
const bot = new Melody();

const poster = AutoPoster(bot.config.topgg, bot);

bot.start();

poster.on("posted", (stats) => {
  // ran when succesfully posted
  bot.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
});

export default bot;
