const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "leave",
    aliases: ["goaway", "disconnect"],
    description: "Leave The Voice Channel!",
    usage: "Leave",
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        "I'm sorry but you need to be in a voice channel!",
        message.channel
      );
    if (!message.guild.me.voice.channel)
      return sendError("I am not in any voice channel!", message.channel);

    const queue = message.client.queue.get(message.guild.id);

    try {
      await message.guild.me.voice.channel.leave();
    } catch (error) {
      await message.guild.me.voice.kick(message.guild.me.id);
      message.client.queue.delete(message.guild.id);
      return sendError("Trying To Leave The Voice Channel...", message.channel);
    }

    message.react("✅");

    const Embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription("Left the voice channel.");

    return message.channel.send(Embed).catch(() => message.channel.send(""));
  },
};
