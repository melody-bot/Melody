const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");
const _ = require("lodash");

module.exports = {
  name: "lyrics",
  description: "Search lyrics for any song",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
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

    let SongTitle = args.join(" ");

    if (!args[0] && !player)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );

    if (!args) SongTitle = player.queue.current.title;

    let lyrics = await lyricsFinder(SongTitle);

    if (!lyrics)
      return sendError(
        `No lyrics found for - \`${SongTitle}\``,
        message.channel
      );

    lyrics = lyrics.split("\n");

    const SplitedLyrics = _.chunk(lyrics, 45);

    const Pages = SplitedLyrics.map((ly) => {
      const em = new MessageEmbed()
        .setAuthor(`${SongTitle} — Lyrics`, client.config.IconURL)
        .setColor("343434")
        .setDescription(ly.join("\n"));

      if (args.join(" ") !== SongTitle)
        em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });
    return !Pages.length || Pages.length === 1
      ? message.channel.send(Pages[0])
      : client.Pagination(message, Pages);
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        description: "Get the lyrics of a song",
        required: false,
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
      const player = await client.Manager.get(interaction.guild_id);
      const channel = client.channels.cache.get(interaction.channel_id);

      if (!interaction.data.options && !player)
        return sendError(
          "There is nothing playing in this server.",
          interaction
        );

      const SongTitle = interaction.data.options
        ? interaction.data.options[0].value
        : player.queue.current.title;

      interaction.send(`Searching . . .`);

      let lyrics = await lyricsFinder(SongTitle);
      if (!lyrics)
        return sendError(`No lyrics found for ${SongTitle}`, channel);
      lyrics = lyrics.split("\n");
      const SplitedLyrics = _.chunk(lyrics, 45);

      const Pages = SplitedLyrics.map((ly) => {
        const em = new MessageEmbed()
          .setAuthor(`${SongTitle}  — Lyrics`, client.config.IconURL)
          .setColor("343434")
          .setDescription(ly.join("\n"));

        return em;
      });

      return channel.send(Pages[0]);
    },
  },
};
