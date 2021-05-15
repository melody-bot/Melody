const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "join",
    aliases: ["join", "enter"],
    description: "Melody joins the voice channel!",
    usage: "join",
  },
  // skipcq
  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        "I'm sorry but you need to be in a voice channel!",
        message.channel
      );

    try {
      const connection = await channel.join(); // skipcq
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(
        `I could not join the voice channel: ${error}`,
        message.channel
      );
    }

    const queue = message.client.queue.get(message.guild.id);
    if (queue)
      return sendError("I am already in a voice channel!", message.channel);

    const YOYO = new MessageEmbed()
      .setAuthor("")
      .setColor("GREEN")
      .setDescription("Joined the voice channel!");

    return message.channel.send(YOYO).catch(() => message.channel.send(""));
  },
};
