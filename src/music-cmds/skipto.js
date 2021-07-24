const { MessageEmbed } = require("discord.js");
const sendError: any = require("../util/error");

module.exports = {
  name: "skipto",
  description: `Skip to a song in the queue`,
  usage: "skipto <index>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  example: ["skipto 11", "st 7"],
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
      message.guild.me.voice.channel &&
      message.guild.me.voice.channel != message.member.voice.channel
    )
      return sendError(
        `You must be in ${message.guild.me.voice.channel} to use this command.`,
        message.channel
      );

    try {
      if (!args[0])
        return sendError(
          `You need to tell how many songs to skip!`,
          message.channel
        );

      if (Number(args[0]) > player.queue.size)
        return sendError(
          `That song is not in the queue! Please try again!`,
          message.channel
        );

      player.queue.remove(0, Number(args[0]) - 1);

      player.stop();

      return message.channel.send(
        new MessageEmbed()
          .setDescription(`Skipped \`${Number(args[0] - 1)}\` songs`)
          .setColor("GREEN")
      );
    } catch (e) {
      client.log(e);
      client.sendError(message.channel, "Something went wrong.");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "number",
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
      const guild: any = interaction.guild;
      const player: any = await client.Manager.get(interaction.guild.id);
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

      try {
        if (interaction.data.options[0].value > player.queue.size)
          return sendError(
            `That song is not in the queue! Please try again!`,
            interaction
          );

        player.queue.remove(0, interaction.data.options[0].value - 1);

        player.stop();

        return interaction.send(
          new MessageEmbed()
            .setDescription(
              `Skipped \`${interaction.data.options[0].value - 1}\` songs`
            )
            .setColor("GREEN")
        );
      } catch (e) {
        client.log(e);
        client.sendError(interaction, "Something went wrong.");
      }
    },
  },
};
