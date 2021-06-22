const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const sendError = require("../util/error");

module.exports = {
  name: "grab",
  description: "Saves the current playing song to your Direct Messages",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
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
    const player = await client.Manager.get(message.guild.id);

    if (!player)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );

    try {
      const embed = new MessageEmbed()
        .setAuthor(`Song`, client.user.displayAvatarURL())
        .setThumbnail(
          `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
        )
        .setURL(player.queue.current.uri)
        .setColor("343434")
        .setTimestamp()
        .setTitle(`${player.queue.current.title}`)
        .addField(
          `Duration: `,
          `${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })} minutes`,
          true
        )
        .addField(`Author: `, `${player.queue.current.author}`, true)
        .addField(
          `Play it:`,
          `\`${client.config.DefaultPrefix}play ${player.queue.current.uri}\``
        )
        .addField(`Used in:`, `<#${message.channel.id}>`, true)
        .setFooter(
          `Requested by: ${player.queue.current.requester.tag}`,
          player.queue.current.requester.displayAvatarURL({
            dynamic: true,
          })
        );
      user.send(embed);
    } catch (e) {
      client.log(e);
      return sendError("Your DMs are disabled", message.channel);
    }

    client.sendTime(message.channel, "**Check your DMs!**");
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
      const user = client.users.cache.get(interaction.member.user.id);
      const player = await client.Manager.get(interaction.guild_id);

      if (!player)
        return sendError(
          "There is nothing playing in this server.",
          interaction
        );

      try {
        const embed = new MessageEmbed()
          .setAuthor(`Song`, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor("343434")
          .setTimestamp()
          .setTitle(`${player.queue.current.title}`)
          .addField(
            `Duration: `,
            `${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })} minutes`,
            true
          )
          .addField(`Author: `, `${player.queue.current.author}`, true)
          .addField(
            `Play it:`,
            `\`${client.config.DefaultPrefix}play ${player.queue.current.uri}\``
          )
          .addField(`Used in:`, `<#${interaction.channel_id}>`, true)
          .setFooter(
            `Requested by: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        client.log(e);
        return sendError("Your DMs are disabled", interaction);
      }

      client.sendTime(interaction, "**Check your DMs!**");
    },
  },
};
