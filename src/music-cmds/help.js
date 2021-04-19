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
        "Melody is a feature-rich music bot that comes with 24/7 and other\n premium features for free, invite Melody now! To get __all the information__\n about our bot please visit [our bot's wiki](https://github.com/noneedofit/Guides/wiki/Melody)\n\n`.play ['p']` - To play songs! You can also play a youtube video with its \nurl or just write the song name -` .p <song-name>`\n"
      )

      .addField(
        "HELP/SUPPORT",
        `For any queries, doubts or any kind of bug reports you can join \nour [Support Server](${client.config.SupportServer})\nAnd any new major changes
        being done to the bot will be updates in the\n change log we have in the .about cmd.`,
        false
      )

      .addField(
        "PATREON",
        `You can support us to help us keep working on Melody,\n [click here to become a patreon](https://https:patreon.com/noneedofit)`,
        false
      )

      .addField(
        "NOTE :-",
        `In no way shall Melody bot be used to do anything that is against \ndiscord's [community guidelines.](https://discord.com/guidelines)`,
        true
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
          "Melody is a feature-rich music bot that comes with 24/7 and other\n premium features for free, invite Melody now! To get __all the information__\n about our bot please visit [our bot's wiki](https://github.com/noneedofit/Guides/wiki/Melody)\n\n`.play ['p']` - To play songs! You can also play a youtube video with its \nurl or just write the song name -` .p <song-name>`\n"
        )

        .addField(
          "HELP/SUPPORT",
          `For any queries, doubts or any kind of bug reports you can join \nour [Support Server](${client.config.SupportServer})\nAnd any new major changes
        being done to the bot will be updates in the\n change log we have in the .about cmd.`,
          false
        )

        .addField(
          "PATREON",
          `You can support us to help us keep working on Melody,\n [click here to become a patreon](https://https:patreon.com/noneedofit)`,
          false
        )

        .addField(
          "NOTE :-",
          `In no way shall Melody bot be used to do anything that is against \ndiscord's [community guidelines.](https://discord.com/guidelines)`,
          true
        )

        .setFooter(`Thanks for using Melody! `);

      return interaction.send(embed);
    },
  },
};
