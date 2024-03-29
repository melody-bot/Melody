const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "seek",
  description: "Seek to a position in the song",
  usage: "seek <time s/m/h>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["forward"],
  example: ["seek 45s", "forward 2m"],
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

    if (!player.queue.current.isSeekable)
      return sendError("We can't seek in this song!", message.channel);

    const SeekTo = client.ParseHumanTime(args.join(" "));

    if (!SeekTo)
      return sendError("Please enter a value to seek!", message.channel);
    player.seek(SeekTo * 1000);
    const seekEmbed = new MessageEmbed()
      .setAuthor(player.queue.current.title)
      .setDescription(
        `\`${
          client.ProgressBar(player.position, player.queue.current.duration, 27)
            .Bar
        } | [${prettyMilliseconds(player.position, {
          colonNotation: true,
        })} / ${prettyMilliseconds(player.queue.current.duration, {
          colonNotation: true,
        })}]\``
      );
    message.react("✅");
    return message.channel.send(seekEmbed);
  },

  SlashCommand: {
    options: [
      {
        name: "seek",
        description: "Seek to any part of a song",
        value: "time",
        type: 3,
        required: true,
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const player = await client.Manager.get(interaction.guild_id);

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

      if (!player.queue.current.isSeekable)
        return sendError("We can't seek in this song!", interaction);
      const SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
      if (!SeekTo) return interaction.send("Please enter a time to seek!");
      player.seek(SeekTo * 1000);
      const seekEmbed = new MessageEmbed()
        .setAuthor(player.queue.current.title)
        .setDescription(
          `\`${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              27
            ).Bar
          } | [${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
        );
      return interaction.send(seekEmbed);
    },
  },
};
