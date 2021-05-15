const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "nowplaying",
    description: "To show the music which is currently playing in this server",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    // skipcq
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );
    let song = serverQueue.songs[0];
    let thing = new MessageEmbed()
      .setAuthor("Song being played currently")
      .setColor("343434")
      .setDescription(`[${song.title}](${song.url})`)
      .setFooter(`Requested by - ${song.req.tag}`);
    return message.channel.send(thing);
  },
};
