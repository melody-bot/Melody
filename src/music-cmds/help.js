const { MessageEmbed } = require("discord.js");
const disbut = require("discord-buttons");

module.exports = {
  name: "help",
  description: "Basic usage information of the bot",
  usage: "help",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["commands", "cmd"],
  example: ["help", "commands"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const site = new disbut.MessageButton()
      .setLabel("Website")
      .setUrl("https://melody-bot.tech")
      .setStyle("url");

    const inv = new disbut.MessageButton()
      .setLabel("Invite")
      .setUrl(
        "https://discord.com/oauth2/authorize?client_id=809283972513267752&permissions=2163734592&scope=bot%20applications.commands"
      )
      .setStyle("url");

    const row = new MessageActionRow().addComponents(site, inv);

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

    return message.channel.send(embed, row);
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
      const site = new disbut.MessageButton()
        .setLabel("Website")
        .setUrl("https://melody-bot.tech")
        .setStyle("url");

      const inv = new disbut.MessageButton()
        .setLabel("Invite")
        .setUrl(
          "https://discord.com/oauth2/authorize?client_id=809283972513267752&permissions=2163734592&scope=bot%20applications.commands"
        )
        .setStyle("url");

      const row = new MessageActionRow().addComponents(site, inv);

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

      return interaction.send(embed, row);
    },
  },
};
