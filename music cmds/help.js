const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "help",
    description: "To show all commands",
    usage: "[command]",
    aliases: ["commands", "help me", "pls help"],
  },
  // skipcq
  run: async function (client, message, args) {
    let embed = new MessageEmbed()
      .setAuthor(
        " " + client.user.username,
        "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png"
      )
      .setColor("343434")
      .setDescription(
        "Melody is a feature-rich music bot that comes with 24/7 and other\n premium features for free, invite Melody now! To get __all the information__\n about our bot please visit [our bot's wiki](https://github.com/noneedofit/Guides/wiki/Melody)\n\n`.play ['p']` - To play songs! You can also play a youtube video with its \nurl or just write the song name -` .p <song-name>`\n"
      )

      .addField(
        "HELP/SUPPORT",
        `For any queries, doubts or any kind of bug reports you can join \nour [Support Server](https://discord.gg/QfZdQynYbg)\nAnd any new major changes
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

    message.channel.send(embed);

    return;
  },
};
