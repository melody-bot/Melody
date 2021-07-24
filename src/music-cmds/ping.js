module.exports = {
  name: "ping",
  description: "To check bot availability and response latency of the bot",
  usage: "ping",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ping", "check"],
  example: ["ping", "check"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    message.reply("Calculating ping...").then((resultMessage) => {
      const ping : any = resultMessage.createdTimestamp - message.createdTimestamp;

      resultMessage.edit(
        `**PONG!**\n**Bot** Ping: ${ping} ms,\n**API Latency**: ${client.ws.ping}` +
          "ms"
      );
    });
    return;
  },
  SlashCommand: {
    // skipcq
    run: async (client, interaction, args) => {
      return interaction.send(
        `**PONG!**\n Use .ping command to get complete info.`
      );
    },
  },
};
