const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  name: "say",
  description: "To say some message",
  usage: "say <message>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  example: ["say hello", "say thanks"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const sayString = args.join(" ");
    if (!sayString)
      return sendError(
        "You didn't provide what you want me to say",
        message.channel
      );

    const say = new MessageEmbed()
      .setDescription(`**${sayString}**`)
      .setFooter(`Requested by - ${message.author.tag}`);
    return message.channel.send(say);
  },

  SlashCommand: {
    options: [
      {
        name: "say",
        value: "something",
        type: 3,
        required: true,
        description: "Say something",
      },
    ],
    /**
     *
     * @param {import("../melodyClient")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    // skipcq
    run: async (client, interaction, args) => {
      // const guild = client.guilds.cache.get(interaction.guild_id);
      // const member = guild.members.cache.get(interaction.member.user.id);
      const sayString = interaction.data.options[0].value;
      const ping = "@everyone";

      if (sayString.includes(ping) === true)
        return sendError(`Hey, I don't mention everyone!`, interaction);

      const say = new MessageEmbed().setDescription(`**${sayString}**`);
      //TODO .setFooter(`Requested by - ${member.user.tag}`)
      return interaction.send(say);
    },
  },
};
