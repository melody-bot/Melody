const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");
const sendError = require("../util/error");

module.exports = {
  name: "queue",
  description: "The server queue",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q"],
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

    if (!player.queue || !player.queue.length || player.queue === 0) {
      try {
        const QueueEmbed = new MessageEmbed()
          .setAuthor("Playing", client.config.IconURL)
          .setColor("343434")
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField(
            "Duration",
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
        return message.channel.send(QueueEmbed);
      } catch {
        return sendError(
          `There is nothing playing in this server.`,
          message.channel
        );
      }
    }

    const Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    const ChunkedSongs = _.chunk(Songs, 10);

    const Pages = ChunkedSongs.map((Tracks) => {
      const SongsDescription = Tracks.map(
        (t) =>
          `${t.index + 1}. [${t.title}](${t.uri}) \`${prettyMilliseconds(
            t.duration,
            { colonNotation: true }
          )}\``
      ).join("\n");

      const Embed = new MessageEmbed()
        .setAuthor("Queue", client.config.IconURL)
        .setColor("343434")
        .setDescription(
          `**Playing:** [${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
        )
        .addField("Total songs: ", `${player.queue.totalSize - 1}`, true)
        .addField(
          "Total length: ",
          `${prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          })}`,
          true
        )
        .addField(
          "Current song duration:",
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
      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
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
      const player = await client.Manager.get(interaction.guild_id);
      const awaitchannel = client.channels.cache.get(interaction.channel_id);
      if (!player)
        return sendError(
          "There is nothing playing in this server.",
          interaction
        );
      if (!player.queue || !player.queue.length || player.queue === 0) {
        try {
          const QueueEmbed = new MessageEmbed()
            .setAuthor("Playing", client.config.IconURL)
            .setColor("343434")
            .setDescription(
              `[${player.queue.current.title}](${player.queue.current.uri})`
            )
            .addField(
              "Duration",
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
          return interaction.send(QueueEmbed);
        } catch {
          return sendError(
            `There is nothing playing in this server.`,
            interaction
          );
        }
      }

      interaction.send(`Getting the server queue . . .`);

      const Songs = player.queue.map((t, index) => {
        t.index = index;
        return t;
      });

      const ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

      const Pages = ChunkedSongs.map((Tracks) => {
        const SongsDescription = Tracks.map(
          (t) =>
            `${t.index + 1}. [${t.title}](${t.uri}) \`${prettyMilliseconds(
              t.duration,
              { colonNotation: true }
            )}\``
        ).join("\n");

        const Embed = new MessageEmbed()
          .setAuthor("Queue", client.config.IconURL)
          .setColor("343434")
          .setDescription(
            `Playing: [${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
          )
          .addField("Total songs: ", `\`${player.queue.totalSize - 1}\``, true)
          .addField(
            "Total length: ",
            `\`${prettyMilliseconds(player.queue.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(
            "Current song duration:",
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
        return Embed;
      });

      if (!Pages.length || Pages.length === 1)
        return awaitchannel.send(Pages[0]);
      else
        awaitchannel.send(
          `There are more than 1 pages in the queue, use the text command to view them`
        );
    },
  },
};
