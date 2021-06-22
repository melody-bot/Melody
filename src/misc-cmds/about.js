const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const utils = require("os-utils");

module.exports = {
  name: "about",
  description: "Information about Melody.",
  usage: "about",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["info"],
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

    const Embed = new MessageEmbed()

      .setAuthor(
        "About Melody",
        "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png"
      )
      .setColor("ffefd5")
      .setDescription(
        "**__DEVELOPER INFO__**\n \nMelody bot is made and run by `noneedofit#5868` and\n `behind_the_hat_#2838`, for us Melody is our first discord.js project."
      )

      .addField(
        "**IMPORTANT**",
        `Those who don't find slash commands in their server is likely\n because of missing permissions. Please re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
          client.config.ClientID
        }&permissions=${
          client.config.Permissions
        }&scope=bot%20${client.config.Scopes.join("%20")})`
      )

      .addField(
        "Melody Stats:",
        `Servers: **${client.guilds.cache.size}**\nUsers: **${client.users.cache.size}**\nChannels: **${client.channels.cache.size}**`,
        true
      )
      .addField("Bot Uptime", `${uptime}`, true)
      .addField(
        "Bot Guide",
        `[click here to read Melody bot wiki](https://www.github.com/noneedofit/Guides/wiki/Melody)`,
        false
      )
      .addField(
        "Change Log",
        `- Slash commands integration and major embed changes.\n- Now you can vote Melody on top.gg, use .vote to vote, rewards coming soon!\n- You can now change the bot prefix using @Melody prefix <ur-prefix>, you can also check the server prefix by using \n<@809283972513267752> prefix\n- Now you require DJ role or few perms to
        skip/clearqueue commands.`
      );

    return message.channel.send(Embed).catch(() => message.channel.send(""));
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

      const Embed = new MessageEmbed()

        .setAuthor(
          "About Melody",
          "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png"
        )
        .setColor("ffefd5")
        .setDescription(
          "**__DEVELOPER INFO__**\n \nMelody bot is made and run by `noneedofit#5868` and\n `behind_the_hat_#2838`, for us Melody is our first discord.js project."
        )

        .addField(
          "**IMPORTANT**",
          `Those who don't find slash commands in their server is likely\n because of missing permissions. Please re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
            client.config.ClientID
          }&permissions=${
            client.config.Permissions
          }&scope=bot%20${client.config.Scopes.join("%20")})`
        )

        .addField(
          "Melody Stats:",
          `Servers: **${client.guilds.cache.size}**\nUsers: **${client.users.cache.size}**\nChannels: **${client.channels.cache.size}**`,
          true
        )
        .addField("Bot Uptime", `${uptime}`, true)
        .addField(
          "Bot Guide",
          `[click here to read Melody bot wiki](https://www.github.com/noneedofit/Guides/wiki/Melody)`,
          false
        )
        .addField(
          "Change Log",
          `- Slash commands integration and major embed changes.\n- Now you can vote Melody on top.gg, use .vote to vote, rewards coming soon!\n- You can now change the bot prefix using @Melody prefix <ur-prefix>, you can also check the server prefix by using \n<@809283972513267752> prefix\n- Now you require DJ role or few perms to
            skip/clearqueue commands.`
        );

      return interaction.send(Embed).catch(() => interaction.send(""));
    },
  },
};
