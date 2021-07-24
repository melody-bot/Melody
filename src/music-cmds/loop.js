const sendError: any = require("../util/error");

module.exports = {
  name: "loop",
  description: "Loop the current song",
  usage: "loop",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["l", "repeat"],
  example: ["repeat", "loop"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const player: any = await client.Manager.get(message.guild.id);

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
      message.guild.me.voice &&
      message.guild.me.voice.channel.id !== message.member.voice.channel.id
    )
      return sendError(
        `You must be in ${message.guild.me.voice.channel} to use this command.`,
        message.channel
      );

    if (player.trackRepeat) {
      player.setTrackRepeat(false);
      message.channel.send(`\`disabled\``);
    } else {
      player.setTrackRepeat(true);
      message.channel.send(`\`enabled\``);
    }
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
      const guild: any = client.guilds.cache.get(interaction.guild_id);
      const member: any = guild.members.cache.get(interaction.member.user.id);

      const player: any = await client.Manager.get(interaction.guild_id);

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

      if (player.trackRepeat) {
        player.setTrackRepeat(false);
        interaction.send(`\`disabled\``);
      } else {
        player.setTrackRepeat(true);
        interaction.send(`\`enabled\``);
      }
    },
  },
};
