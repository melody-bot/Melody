const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "about",
  description: "Information about Melody.",
  usage: "about",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["info"],
  example: ["info", "about"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    message.react("✅");

    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, \n${minutes} mins and ${seconds} secs`;

    let members = [];

    client.guilds.cache.forEach((g) => {
      members.push(g.memberCount);
    });

    const users = members.reduce((a, b) => a + b, 0);

    client.database.model.countDocuments({}, (err, count) => {
      if (err) return client.log(err);
      const Embed = new MessageEmbed()
        .setColor("ffefd5")
        .addField(
          "Notice Board",
          `Those who don't find slash commands in their server\n is likely because of missing permissions. Please\nre-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
            client.config.ClientID
          }&permissions=${
            client.config.Permissions
          }&scope=bot%20${client.config.Scopes.join("%20")})`
        )

        .addField(
          "Melody Stats:",
          `Servers: **${client.guilds.cache.size}**\nUsers: **${users}**\nSongs Played: **${count}**\nChannels: **${client.channels.cache.size}**`,
          true
        )
        .addField("Bot Uptime", `${uptime}`, true)
        .addField(
          "Bot Guide",
          `[Melody Wiki](https://www.github.com/melody-bot/Melody/wiki)\n[Developer Guide](https://github.com/melody-bot/Melody/wiki/For-Developers)\n[Website](https://melody-bot.tech)`,
          true
        )
        .addField(
          "Change Log",
          `- The new \`history\` command shows guild history, and personal history\n with the \`personal\` argument.\n- Play multiple songs at a time by seperating them with \`;;\` operator.\n- Create collections to store songs and playlists!\n- More on melody song collections [here](https://github.com/melody-bot/Melody/wiki/Song-Collections).\n- **Check Melody 3.3 [release notes](https://github.com/melody-bot/Melody/releases/tag/v3.3.0)**`
        )
        .addField(
          "Developers",
          "Melody bot is maintained by [Dhruv](https://github.com/noneedofit) and [Kush](https://github.com/git-kush).\nSupport Melody by becoming a [Patreon](https://patreon.com/noneedofit)"
        )
        .addField(
          "License Notice",
          "Melody is licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0.txt)"
        )
        .setFooter("Copyright © Melody 2021", client.config.IconURL);

      return message.channel.send(Embed).catch(() => message.channel.send(""));
    });
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Command help",
        value: "command",
        type: 3,
        required: false,
      },
    ],
    // skipcq
    run: async (client, interaction, args) => {
      let totalSeconds = client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);

      let uptime = `${days} days, ${hours} hours, \n${minutes} mins and ${seconds} secs`;

      let members = [];

      client.guilds.cache.forEach((g) => {
        members.push(g.memberCount);
      });

      const users = members.reduce((a, b) => a + b, 0);

      client.database.model.countDocuments({}, (err, count) => {
        if (err) return client.log(err);
        const Embed = new MessageEmbed()
          .setColor("ffefd5")
          .addField(
            "Notice Board",
            `Those who don't find slash commands in their server\n is likely because of missing permissions. Please\nre-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
              client.config.ClientID
            }&permissions=${
              client.config.Permissions
            }&scope=bot%20${client.config.Scopes.join("%20")})`
          )

          .addField(
            "Melody Stats:",
            `Servers: **${client.guilds.cache.size}**\nUsers: **${users}**\nSongs Played: **${count}**\nChannels: **${client.channels.cache.size}**`,
            true
          )
          .addField("Bot Uptime", `${uptime}`, true)
          .addField(
            "Bot Guide",
            `[Melody Wiki](https://www.github.com/melody-bot/Melody/wiki)\n[Developer Guide](https://github.com/melody-bot/Melody/wiki/For-Developers)\n[Website](https://melody-bot.tech)`,
            true
          )
          .addField(
            "Change Log",
            `- The new \`history\` command shows guild history, and personal history\n with the \`personal\` argument.\n- Play multiple songs at a time by seperating them with \`;;\` operator.\n- Run multiple commands from a single message by seperating them\n with the \`&&\` operator.\n- Get information on any command using the \`--help\` flag.\n*Check Melody 3.0 [release notes](https://github.com/melody-bot/Melody/releases/tag/v3.0.0)*`
          )
          .addField(
            "Developers",
            "Melody bot is maintained by [Dhruv](https://github.com/noneedofit) and [Kush](https://github.com/git-kush).\nSupport Melody by becoming a [Patreon](https://patreon.com/noneedofit)"
          )
          .addField(
            "License Notice",
            "Melody is licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0.txt)"
          )
          .setFooter("Copyright © Melody 2021", client.config.IconURL);

        return interaction.send(Embed).catch(() => interaction.send(""));
      });
    },
  },
};
