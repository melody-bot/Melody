module.exports = {
  info: {
    name: "ping",
    description: "To check bot availability and response latency of the bot",
    usage: "[ping]",
    aliases: ["ping"],
  },

  run: async function (client, message, args) {
    // skipcq
    message.reply("Calculating ping...").then((resultMessage) => {
      const ping = resultMessage.createdTimestamp - message.createdTimestamp;

      resultMessage.edit(
        `**PONG!**\n**Bot** Ping: ${ping} ms,\n**API Latency**: ${client.ws.ping}` +
          "ms"
      );
    });
    return;
  },
};
