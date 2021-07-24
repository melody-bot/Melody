const { MessageEmbed } = require("discord.js");
const sendError: any = require("../util/error");

module.exports = {
  name: "join",
  description: "Join a voice channel",
  usage: "join",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["jn", "come"],
  example: ["join", "jn"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const player: any = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

    if (!message.member.voice.channel)
      return sendError(
        "You need to be in a voice channel to use this command!",
        message.channel
      );

    if (message.guild.me.voice.channel)
      return sendError(
        `I am already there in ${message.guild.me.voice.channel}!`,
        message.channel
      );

    player.connect();

    return message.react("✅");
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

      const player: any = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

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

      if (guild.me.voice.channel)
        return sendError(
          `I am already there in ${guild.me.voice.channel}!`,
          interaction
        );

      player.connect();

      const Embed: any = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("Joined the voice channel.");

      return interaction.send(Embed).catch(() => interaction.send(""));
    },
  },
};
