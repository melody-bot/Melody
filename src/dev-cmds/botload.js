const { MessageEmbed } = require("discord.js");
const os = require("os");
const osu = require("node-os-utils");
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

    const isDeveloper = CheckDeveloper(message.author.id);

    if (isDeveloper == false)
      return message.channel.send("Only my developers can use this command.");

    const memUsed = await mem.used();
    let usedMemory = memUsed.usedMemMb;

    const memUsedPercentage = (memUsed.usedMemMb / memUsed.totalMemMb) * 100;
    let usedPercentage = memUsedPercentage;

    function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function dhm(t) {
      const cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor((t - d * cd) / ch),
        m = Math.round((t - d * cd - h * ch) / 60000),
        pad = function (n) {
          return n < 10 ? "0" + n : n;
        };
      if (m === 60) {
        h++;
        m = 0;
      }
      if (h === 24) {
        d++;
        h = 0;
      }
      return [d, pad(h), pad(m)].join(":");
    }

    let totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const node1 = await client.Manager.nodes.get(client.config.Lavalink[0].id);
    const node2 = await client.Manager.nodes.get(client.config.Lavalink[1].id);
    const node3 = await client.Manager.nodes.get(client.config.Lavalink[2].id);

    const uptime = `${days} days, ${hours} hours, \n${minutes} mins and ${seconds} secs`;

    const loadEmbed = new MessageEmbed()

      .setAuthor(
        "Melody Server Stats",
        `https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png`
      )
      .setColor("PINK")
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
      )
      .addField(
        `Lavalink Node 1`,
        `Memory: ${formatBytes(
          node1.stats.memory.used
        )}\nCPU: ${node1.stats.cpu.systemLoad.toPrecision(5)}\nPlayers: ${
          node1.stats.players
        }\nUptime: ${dhm(node1.stats.uptime)}`,
        true
      )
      .addField(
        `Lavalink Node 2`,
        `Memory: ${formatBytes(
          node2.stats.memory.used
        )}\nCPU: ${node2.stats.cpu.systemLoad.toPrecision(5)}\nPlayers: ${
          node2.stats.players
        }\nUptime: ${dhm(node2.stats.uptime)}`,
        true
      )
      .addField(
        `Lavalink Node 3`,
        `Memory: ${formatBytes(
          node3.stats.memory.used
        )}\nCPU: ${node3.stats.cpu.systemLoad.toPrecision(5)}\nPlayers: ${
          node3.stats.players
        }\nUptime: ${dhm(node3.stats.uptime)}`,
        true
      );
    return message.channel.send(loadEmbed);
  },
};
