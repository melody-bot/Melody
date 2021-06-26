const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "To know about the bot and commands",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setAuthor(` ${client.user.username}`, `${client.config.IconURL}`)
      .setColor("343434")
      .setDescription(
        "`.play ['p']` - To play songs! Give the url,\nor just write the song name - `.p <song>`\n\nMelody is a feature-rich music bot with \nall premium features (for free!). To get all\n the information, please check [the wiki.](https://github.com/melody-bot/Melody/wiki)\n\n"
      )

      .addField(
        "**IMPORTANT**",
        `Those who don't find slash commands \nplease re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
          client.config.ClientID
        }&permissions=${
          client.config.Permissions
        }&scope=bot%20${client.config.Scopes.join("%20")})`
      )

      .addField(
        "HELP/SUPPORT",
        `Report bugs in our [Support Server.](${client.config.SupportServer})\nMajor changes being done to the bot\n are in the change log in the \`.about\` cmd.\n If you are a developer, reach out\n to us on [GitHub](https://github.com/melody-bot/Melody)`,
        false
      )

      .setFooter(`Thanks for using Melody! `);

    return message.channel.send(embed);
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
      const embed = new MessageEmbed()
        .setAuthor(` ${client.user.username}`, `${client.config.IconURL}`)
        .setColor("343434")
        .setDescription(
          "`.play ['p']` - To play songs! Give the url,\nor just write the song name - `.p <song>`\n\nMelody is a feature-rich music bot with \nall premium features (for free!). To get all\n the information, please check [the wiki.](https://github.com/melody-bot/Melody/wiki)\n\n"
        )

        .addField(
          "**IMPORTANT**",
          `Those who don't find slash commands \nplease re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
            client.config.ClientID
          }&permissions=${
            client.config.Permissions
          }&scope=bot%20${client.config.Scopes.join("%20")})`
        )

        .addField(
          "HELP/SUPPORT",
          `Report bugs in our [Support Server.](${client.config.SupportServer})\nMajor changes being done to the bot\n are in the change log in the \`.about\` cmd.\n If you are a developer, reach out\n to us on [GitHub](https://github.com/melody-bot/Melody)`,
          false
        )

        .setFooter(`Thanks for using Melody! `);

      return interaction.send(embed);
    },
  },
};
