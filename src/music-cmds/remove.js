const { MessageEmbed } = require("discord.js");
const sendError: any = require("../util/error");

module.exports = {
  name: "remove",
  description: `Remove a song from the queue`,
  usage: "remove <index>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["rm"],
  example: ["remove 3", "remove 21"],

  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const player: any = await client.Manager.players.get(message.guild.id);
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return sendError(
        "There is nothing in the queue to remove",
        message.channel
      );
    const rm: any = new MessageEmbed()
      .setDescription(`Removed \`${Number(args[0])}\` from the queue!`)
      .setColor("GREEN");
    if (isNaN(args[0])) rm.setDescription(`Tell me what to remove!`);
    if (args[0] > player.queue.length)
      rm.setDescription(`The queue has only ${player.queue.length} songs!`);

    await message.channel.send(rm);

    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
        name: "remove",
        value: "[number]",
        type: 4,
        required: true,
        description: "Remove a song from the queue",
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
      const player: any = await client.Manager.get(interaction.guild_id);
      const guild: any = client.guilds.cache.get(interaction.guild_id);
      const member: any = guild.members.cache.get(interaction.member.user.id);

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

      const rm: any = new MessageEmbed()
        .setDescription(`Removed track \`${Number(args[0])}\` from the queue!`)
        .setColor("GREEN");
      if (isNaN(args[0])) rm.setDescription(`Tell me what to remove!`);
      if (args[0] > player.queue.length)
        rm.setDescription(`The queue has only ${player.queue.length}!`);
      await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  },
};
