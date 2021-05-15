const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "resume",
    description: "To resume the paused music",
    usage: "",
    aliases: [],
  },
  // skipcq
  run: async function (client, message, args) {

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
        .setDescription("Resumed the music for you!")
        .setColor("GREEN")
        .setAuthor("");
      return message.channel.send(xd);
    }
    return sendError(
      "There is nothing playing in this server.",
      message.channel
    );
  },
};
