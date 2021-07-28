const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const sendSuccess = require("../util/success");

module.exports = {
  name: "leave",
  description: "Disconnecting the bot voice channel",
  usage: "leave",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["stop", "exit", "quit", "dc", "disconnect"],
  example: ["exit", "leave"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const player = await client.Manager.get(message.guild.id);
    const channel = message.member.voice.channel;

    if (!channel)
      return sendError(
        "You need to be in a voice channel to use this command!",
        message.channel
      );
    if (!message.guild.me.voice.channel)
      return sendError("I am not in any voice channel!", message.channel);

    if (
      message.guild.me.voice.channel &&
      message.guild.me.voice.channel != message.member.voice.channel
    )
      return sendError(
        `You must be in ${message.guild.me.voice.channel} to use this command.`,
        message.channel
      );

    try {
      player.destroy();
      message.guild.me.voice.channel.leave();
    } catch (error) {
      return sendError(error, message.channel);
    }

    message.react("✅");
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

      const player = await client.Manager.get(interaction.guild_id);

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

      if (!guild.me.voice.channel)
        return sendError("I am not in any voice channel!", interaction);

      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return sendError(
          `You must be in ${guild.me.voice.channel} to use this command.`,
          interaction
        );

      try {
        player.destroy();
        guild.me.voice.channel.leave();
      } catch (error) {
        return sendError(error, interaction);
      }

      return sendSuccess("Left the voice channel", interaction);
    },
  },
};
