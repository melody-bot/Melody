const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  name: "clear",
  description: "Clears the server queue",
  usage: "clear",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["MANAGE_MESSAGES"],
  },
  aliases: ["cl", "cq"],
  example: ["cl", "clear"],
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return sendError(
        "There are no songs in the queue to clear!",
        message.channel
      );

    player.queue.clear();

    const lol = new MessageEmbed().setDescription(
      "**Cleared the server song queue!\n**Use `.play` to add new songs to the queue."
    );
    await message.channel.send(lol);
  },

  SlashCommand: {
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
      function isPermitted() {
        if (member.hasPermission(["MANAGE_MESSAGES"])) {
          return true;
        } else if (member.roles.cache.some((role) => role.name === "DJ")) {
          return true;
        } else {
          return false;
        }
      }

      let permission = isPermitted();

      if (permission === false)
        return client.sendError(
          interaction,
          "Missing Permissions!\n You need the `DJ` role to access this command."
        );

      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return sendError(
          `You must be in ${guild.me.voice.channel} to use this command.`,
          interaction
        );

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return sendError(
          "There are no songs in the queue to clear!",
          interaction
        );

      player.queue.clear();

      const lol = new MessageEmbed().setDescription(
        "**Cleared the server song queue!\n**Use `.play` to add new songs to the queue."
      );
      await interaction.send(lol);
    },
  },
};
