const mongopref = require("discord-mongodb-prefix");
const mongoose = require("mongoose");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "prefix",
    description: "To change the guild prefix of the bot.",
    usage: "[prefix]",
    aliases: ["prefix"],
  },

  run: async function (client, message, args) {
    const fetchprefix = await mongopref.fetch(client, message.guild.id);
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `, 'u');
    const prefix = message.content.match(prefixMention)
      ? message.content.match(prefixMention)[0]
      : fetchprefix.prefix;

    if (!args[0])
      return message.channel.send(
        `This server's prefix is ` + "`" + fetchprefix.prefix + "`"
      );

    if (!message.member.hasPermission(["MANAGE_GUILD"]))
      return sendError(
        "Oops!, looks like you don'have permission to change the prefix, ask an admin to do this!",
        message.channel
      );
    else {
      let newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
      await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
      message.channel.send(
        `**Successfully changed the prefix from "${fetchprefix.prefix}" to "${newprefix}"**`
      );
    }
  },
};
