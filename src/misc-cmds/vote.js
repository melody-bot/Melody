const { MessageEmbed } = require("discord.js");

const FactList = [
  {
    msg: "The image in the embed was our first logo \n(attempt) Not too proud of that one.. :sweat_smile:",
    thumbnail:
      "https://cdn.discordapp.com/attachments/804258629829918740/830025962329997362/2.png",
  },
  {
    msg: "Melody was first called 'nnoi plays' \n(Based on the username of our founder).",
    thumbnail:
      "https://cdn.discordapp.com/attachments/853976902994100224/856746348623691836/PicsArt_02-11-01.png",
  },
  {
    msg: "There are just 2 employees at Melody, \nwhich are the founder and co-founder respectively.",
    thumbnail:
      "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png",
  },
  {
    msg: "We initially struggled to find a way to keep our \nNodejs app running while we closed our terminal.",
    thumbnail:
      "https://melody.pages.dev/assets/img/code-1839406_1920%20(2).jpg",
  },
  {
    msg: "The owners of Melody are 15 year olds. \n(Seriously, not kidding)",
    thumbnail:
      "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png",
  },
];

module.exports = {
  name: "vote",
  description: "To add/invite the bot to your server.",
  usage: "vote",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vt"],
  example: ["vote", "vt"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const index = Math.floor(Math.random() * FactList.length + 1) - 1;
    const lolXD = new MessageEmbed()
      .setTitle("Vote For Melody")
      .setColor("GREEN")
      .setThumbnail(FactList[index].thumbnail)
      .addField(
        "`Rewards coming soon! <3`",
        `\n[**' VOTE NOW! '**](https://top.gg/bot/809283972513267752/vote)`,
        true
      )
      .addField("**Fun Fact:**", FactList[index].msg)
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
      const index = Math.floor(Math.random() * FactList.length + 1) - 1;
      const lolXD = new MessageEmbed()
        .setTitle("Vote For Melody")
        .setColor("GREEN")
        .setThumbnail(FactList[index].thumbnail)
        .addField(
          "`Rewards coming soon! <3`",
          `\n[**' VOTE NOW! '**](https://top.gg/bot/809283972513267752/vote)`,
          true
        )
        .addField("**Fun Fact:**", FactList[index].msg)
        .setFooter("Thanks for supporting Melody :)");
      return interaction.send(lolXD);
    },
  },
};
