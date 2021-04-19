const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  description: "To add/invite the bot to your server.",
  usage: "vote",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vote"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const lolXD = new MessageEmbed()
      .setTitle("Vote For Melody")
      .setColor("GREEN")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/804258629829918740/830025962329997362/2.png"
      )
      .addField(
        "`Rewards coming soon! <3`",
        `\n[**' VOTE NOW! '**](https://top.gg/bot/809283972513267752/vote)`,
        true
      )
      .addField(
        "**Fun Fact:**",
        `The image in the embed was our first logo \n(attempt) Not too proud of that one.. :sweat_smile:`
      )
      .setFooter("Thanks for supporting Melody :)");
    return message.channel.send(lolXD);
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
      const lolXD = new MessageEmbed()
        .setTitle("Vote For Melody")
        .setColor("GREEN")
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/804258629829918740/830025962329997362/2.png"
        )
        .addField(
          "`Rewards coming soon! <3`",
          `\n[**' VOTE NOW! '**](https://top.gg/bot/809283972513267752/vote)`,
          true
        )
        .addField(
          "**Fun Fact:**",
          `The image in the embed was our first logo \n(attempt) Not too proud of that one.. :sweat_smile:`
        )
        .setFooter("Thanks for supporting Melody :)");
      return interaction.send(lolXD);
    },
  },
};
