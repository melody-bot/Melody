const { MessageEmbed } = require("discord.js");
var os : any = require("os");
var osu : any = require("node-os-utils");
const { mem } = osu;

module.exports = {
  name: "load",
  description: "To view application load.",
  usage: "load",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["load"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    function CheckDeveloper(user_id) {
      return client.config.Developers.includes(user_id) ? true : false;
    }

    const isDeveloper : any = CheckDeveloper(message.author.id);

    if (isDeveloper == false)
      return message.channel.send("Only my developers can use this command.");

    const memUsed : any = await mem.used();
    let usedMemory : any = memUsed.usedMemMb;

    const memUsedPercentage : any = (memUsed.usedMemMb / memUsed.totalMemMb) * 100;
    let usedPercentage : any = memUsedPercentage;

    let totalSeconds : any = client.uptime / 1000;
    const days : any = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours : any = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes : any = Math.floor(totalSeconds / 60);
    const seconds : any = Math.floor(totalSeconds % 60);

    const uptime : string = `${days} days, ${hours} hours, \n${minutes} mins and ${seconds} secs`;

    const loadEmbed : any = new MessageEmbed()

      .setAuthor(
        "Melody Server Stats",
        `https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png`
      )
      .setColor("PINK")
      .setDescription(
        "This is a **developer only** command, Shows the memory usage and other server-side stuff."
      )
      .addField("Memory Used", `${usedMemory} MB`, true)
      .addField(
        "Free Memory",
        `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        true
      )
      .addField("Used Mem(%)", `${usedPercentage.toFixed(2)}`, true)
      .addField(
        "Total Memory",
        `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
        true
      )
      .addField("Average Load for 15 mins", `${os.loadavg(15)}`, true)
      .addField("Platform Name", `${os.platform()}`, true)
      .addField("Bot Uptime", `${uptime}`, true)
      .addField(
        `Running on Node ${process.version.replace(" ", "")}`,
        "**Working fine**",
        true
      )
      .addField(
        `Running Discord.js v${require("discord.js").version.replace(" ", "")}`,
        "**Working fine**",
        true
      );
    message.channel.send(loadEmbed);
  },
};
