const { MessageEmbed } = require("discord.js");
var developers = require("../dev-config");
var os = require("os");
var osu = require("node-os-utils");
const { mem } = osu;

module.exports = {
  info: {
    name: "botload",
    description: "To show the server memory and stat usage",
    usage: "[botload]",
    aliases: ["load"],
  },
  // skipcq
  run: async function (client, message, args) {
    if (Object.values(developers).indexOf(message.author.id) > -1) {
      var dev = true;
    }
    if (dev != true)
      return message.channel.send("Only my developer can use this command...");
    message.channel.send("Developer command confirmed!");

    const memUsed = await mem.used();
    var usedMemory = memUsed.usedMemMb;

    const memUsedPercentage = (memUsed.usedMemMb / memUsed.totalMemMb) * 100;
    var usedPercentage = memUsedPercentage;

    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, \n${minutes} mins and ${seconds} secs`;

    const loadEmbed = new MessageEmbed()

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
