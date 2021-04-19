const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  name: "join",
  description: "Connecting the bot to a voice channel",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["jn", "come"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return sendError(
        "You need to be in a voice channel to use this command!",
        message.channel
      );

    if (message.guild.me.voice.channel)
      return sendError(
        `I am already there in ${message.guild.me.voice.channel}!`,
        message.channel
      );

    message.member.voice.channel.join();

    return message.react("✅");
  },

  SlashCommand: {
    /**
     *
     * @param {import("../melodyClient")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    // skipcq
    run: async (client, interaction, args) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      try {
        if (!member.voice.channel)
          return sendError(
            "You need to be in a voice channel to use this command!",
            interaction
          );
      } catch (e) {
        return sendError(
          "You need to be in a voice channel to use this command!",
          interaction
        );
      }

      if (guild.me.voice.channel)
        return sendError(
          `I am already there in ${guild.me.voice.channel}!`,
          interaction
        );

      member.voice.channel.join();

      const Embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("Joined the voice channel.");

      return interaction.send(Embed).catch(() => interaction.send(""));
    },
  },
};
