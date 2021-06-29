const sendError = require("../util/error");

module.exports = {
  name: "volume",
  description: "Changes the Volume",
  usage: "volume <value>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vol", "v"],
  example: ["volume 70", "v 100"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    let player = await client.Manager.get(message.guild.id);
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

    if (!args[0]) return message.channel.send(`Volume: **${player.volume}**`);
    // skipcq
    if (!parseInt(args[0]))
      return sendError("Please choose between `1 - 100`", message.channel);

    let vol = parseInt(args[0]); // skipcq

    if (!vol || vol < 1 || vol > 100)
      return sendError(`Please choose between \`1 - 100\``, message.channel);
    player.setVolume(vol);
    message.channel.send(`Volume: **${player.volume}**`);
  },
  SlashCommand: {
    options: [
      {
        name: "number",
        value: "number 1 - 100",
        type: 4,
        required: true,
        description: "What do you want to change the volume to?",
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

      if (!args.length) return interaction.send(`Volume: **${player.volume}**`);
      let vol = parseInt(args[0].value); // skipcq
      if (!vol || vol < 1 || vol > 100)
        return sendError(`Please choose between \`1 - 100\``, interaction);
      player.setVolume(vol);
      interaction.send(`Volume: **${player.volume}**`);
    },
  },
};
