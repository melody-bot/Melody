const { MessageEmbed } = require("discord.js");
const prettyMilliseconds : any = require("pretty-ms");
const sendError : any = require("../util/error");

module.exports = {
  name: "nowplaying",
  description: "See what song is currently playing",
  usage: "nowplaying",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["np", "nowplaying", "now playing"],
  example: ["nowplaying", "np"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const player : any = await client.Manager.get(message.guild.id);
    if (!player)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );

    const song : any = player.queue.current;
    const QueueEmbed : any = new MessageEmbed()
      .setAuthor("Playing ♪", client.config.IconURL)
      .setColor("343434")
      .setURL(player.queue.current.uri)
      .setThumbnail(player.queue.current.displayThumbnail())
      .setTitle(`${player.queue.current.title}`)
      .addField("Author", `${song.author}`, true)
      .addField(`Requested by:`, `${player.queue.current.requester}`, true)
      .addField(
        "Duration",
        `\`${
          client.ProgressBar(player.position, player.queue.current.duration, 27)
            .Bar
        } | ${prettyMilliseconds(player.position, {
          colonNotation: true,
        })} / ${prettyMilliseconds(player.queue.current.duration, {
          colonNotation: true,
        })}\``
      );
    return message.channel.send(QueueEmbed);
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
      const player : any = await client.Manager.get(interaction.guild_id);
      if (!player)
        return sendError(
          "There is nothing playing in this server.",
          interaction
        );

      const song : any = player.queue.current;
      const QueueEmbed : any = new MessageEmbed()
        .setAuthor("Playing ♪", client.config.IconURL)
        .setColor("343434")
        .setURL(player.queue.current.uri)
        .setThumbnail(player.queue.current.displayThumbnail())
        .setTitle(`${player.queue.current.title}`)
        .addField("Author", `${song.author}`, true)
        .addField(`Requested by:`, `${player.queue.current.requester}`, true)
        .addField(
          "Duration",
          `\`${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              27
            ).Bar
          } | ${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
        );
      return interaction.send(QueueEmbed);
    },
  },
};
