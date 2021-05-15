const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "clearqueue",
    description: "To clear the server queue",
    usage: "clearqueue",
    aliases: ["cq", "clearqueue", "skipall"],
  },
  // skipcq
  run: async function (client, message, args) {

    const lol = new MessageEmbed().setDescription(
      "**Cleared the server song queue!\n**Use `.play` to add new songs to the queue."
    );

    const serverQueue = message.client.queue.get(message.guild.id);

    function isPermitted() {
      if (message.member.hasPermission(["MANAGE_MESSAGES"])) {
        return true;
      } else if (
        message.member.roles.cache.some((role) => role.name === "DJ")
      ) {
        return true;
      } else {
        return false;
      }
    }

    var permission = isPermitted();

    if (permission == false) {
      return sendError(
        "I am sorry but you clear the queue, ask a DJ to do it for you!\nYou need to have a role named **DJ** or `MANAGE_MESSAGES` permission to use\ncommands like skip and clearqueue.",
        message.channel
      );
    }

    if (message.guild.me.voice.channel != message.member.voice.channel)
      return sendError(
        `I am sorry but you need to be in the same voice channel to use this command!`,
        message.channel
      );

    if (!serverQueue)
      return sendError(
        "There is nothing playing in this server.",
        message.channel
      );

    try {
      serverQueue.connection.dispatcher.end();
      message.client.queue.delete(message.guild.id);
      message.channel.send(lol);
    } catch (error) {
      return sendError(
        `An unexpected error has occurred: ${error}`,
        message.channel.send
      );
    }
  },
};
