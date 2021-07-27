const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const sendError = require("../util/error");

module.exports = {
  name: "history",
  description: "View songs history",
  usage: `history <"personal">(optional)`,
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["--"],
  example: ["history", "history personal"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const user = client.users.cache.get(message.member.user.id);
    let results = await client.database.model
      .find({
        guild: message.guild.id,
      })
      .sort([["date", -1]])
      .limit(100)
      .exec();

    if (args[0] === "personal")
      results = await client.database.model
        .find({
          userid: message.member.id,
        })
        .sort([["date", -1]])
        .limit(100)
        .exec();

    const getDate = dateStr => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date(dateStr);
      const t = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
      const d = `${days[date.getUTCDay()]} ${date.getUTCDate()}`;
      const m = date.getUTCMonth();
      const y = date.getUTCFullYear();
      return `${t}; ${d}/${m}/${y}`;
    }

    if (results.length === 0)
      return sendError("You have not played any songs yet!", message.channel);

    const songs = results.map((name, index) => {
      name.index = index;
      return name;
    });
    const ChunkedSongs = _.chunk(songs, 20);

    const Pages = ChunkedSongs.map((Songs) => {
      const SongsDescription = Songs.map(
        (name) =>
          `**${name.index + 1})** \`${getDate(name.date)}\` [${name.name}](${
            name.url
          })`
      ).join("\n");

      const Embed = new MessageEmbed()
        .setColor("343434")
        .setDescription(SongsDescription);
      if (args[0] === "personal")
        return Embed.setAuthor("Personal History", client.config.IconURL);
      return Embed.setAuthor("Guild History", client.config.IconURL);
    });

    if (args[0] === "personal") {
      try {
        await message.react("✅");
        return user.send(Pages[0]);
      } catch (e) {
        return sendError("You DMs are disabled", message.channel);
      }
    }

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
  },

  SlashCommand: {
    options: [
      {
        name: "scope",
        value: "scope",
        type: 3,
        description: "View play history",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = await guild.members.fetch(interaction.member.user.id);
      let results = await client.database.model
        .find({
          guild: guild.id,
        })
        .sort([["date", -1]])
        .limit(100)
        .exec();

      if (
        interaction.data.options &&
        interaction.data.options[0].value === "personal"
      )
        results = await client.database.model
          .find({
            userid: member.id,
          })
          .sort([["date", -1]])
          .limit(100)
          .exec();

      const getDate = dateStr => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const date = new Date(dateStr);
        const t = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
        const d = `${days[date.getUTCDay()]} ${date.getUTCDate()}`;
        const m = date.getUTCMonth();
        const y = date.getUTCFullYear();
        return `${t}; ${d}/${m}/${y}`;
      }

      if (results.length === 0)
        return sendError("You have not played any songs yet!", interaction);

      const songs = results.map((name, index) => {
        name.index = index;
        return name;
      });

      const ChunkedSongs = _.chunk(songs, 20);

      const Pages = ChunkedSongs.map((Songs) => {
        const SongsDescription = Songs.map(
          (name) =>
            `**${name.index + 1})** \`${getDate(name.date)}\` [${name.name}](${
              name.url
            })`
        ).join("\n");

        const Embed = new MessageEmbed()
          .setColor("343434")
          .setDescription(SongsDescription);
        if (
          interaction.data.options &&
          interaction.data.options[0].value === "personal"
        )
          return Embed.setAuthor("Personal History", client.config.IconURL);
        return Embed.setAuthor("Guild History", client.config.IconURL);
      });

      if (
        interaction.data.options &&
        interaction.data.options[0].value === "personal"
      ) {
        try {
          await member.user.send(Pages[0]);
          const Sucess = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Check your DMs`);
          return interaction.send(Sucess);
        } catch (e) {
          return sendError("You DMs are disabled", interaction);
        }
      }

      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);
      else
        interaction.send(
          `There are more than 1 pages in history, use the text command to view them`
        );
    },
  },
};
