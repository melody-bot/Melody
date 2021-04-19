const sendError = require("../util/error");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
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
    if (!player)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );

    if (
      player.queue &&
      message.channel !== client.channels.cache.get(player.textChannel)
    )
      return sendError(
        `The player is already initialized in ${client.channels.cache.get(
          player.textChannel
        )}, use commands over there or use .leave to stop the current player.`,
        message.channel
      );

    if (!message.member.voice.channel)
      return sendError(
        "You need to be in a voice channel to use this command!",
        message.channel
      );
    if (
      message.guild.me.voice.channel &&
      message.guild.me.voice.channel != message.member.voice.channel
    )
      return sendError(
        `You must be in ${message.guild.me.voice.channel} to use this command.`,
        message.channel
      );
    player.stop();
    await message.react("✅");
  },

  SlashCommand: {
    // skipcq
    run: async (client, interaction, args) => {
      const guild = interaction.guild;
      const player = await client.Manager.get(interaction.guild.id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!player)
        return sendError(
          "There is nothing playing in this server.",
          interaction
        );

      if (
        player.queue &&
        client.channels.cache.get(interaction.channel_id) !==
          client.channels.cache.get(player.textChannel)
      )
        return sendError(
          `The player is already initialized in ${client.channels.cache.get(
            player.textChannel
          )}, use commands over there or use .leave to stop the current player.`,
          interaction
        );

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

      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return sendError(
          `You must be in ${guild.me.voice.channel} to use this command.`,
          interaction
        );

      const skipTo = interaction.data.options
        ? interaction.data.options[0].value
        : null;

      if (
        skipTo !== null &&
        (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
      )
        return sendError("Invalid number to skip.", interaction);
      player.stop(skipTo);
      interaction.send("Skipped the song");
    },
  },
};
