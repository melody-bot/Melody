const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
module.exports = {
  name: "24by7",
  description: "Control 27/7 mode",
  usage: "24by7 <on/off> <timout ms>(Optional)",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["alwaysOn"],
  example: ["24by7 on", "alwaysOn off 300000"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  run: async (client, message, args) => {
    const preference = await client.preferences.model.findOne({
      "guild.id": message.guild.id,
    });
    const time =
      !preference?.twentyfourSeven && preference?.time
        ? preference.time
        : preference && !preference.twentyfourSeven && !preference.time
        ? 300000
        : 0;
    if (!args[0])
      return message.channel.send(
        `24/7 status: \`${
          ((preference && preference.twentyfourSeven) ?? true).toString() +
          ` ${time}ms`
        }\``
      );

    const isPermitted = () => {
      if (message.member.hasPermission(["MANAGE_GUILD"])) {
        return true;
      } else if (
        message.member.roles.cache.some((role) => role.name === "DJ")
      ) {
        return true;
      } else {
        return false;
      }
    };

    let permission = isPermitted();

    if (permission === false)
      return client.sendError(
        message.channel,
        "Missing Permissions!\n You need the `DJ` role or `MANAGE_GUILD` permission to access this command."
      );

    const newPreference = args[0];
    if (newPreference != "on" && newPreference != "off")
      return sendError(
        "Invalid argument (Choose from on or off)",
        message.channel
      );

    const twentyfourSeven = newPreference === "on" ? true : false;

    const newTime = parseInt(args[1]) || 300000;
    if (args[1] && !newTime && !newTime >= 0 && !newTime <= 1800000)
      return sendError(
        "Please choose correct time in milliseconds between 0 and 1800000"
      );

    const previousData = await client.preferences.model.findOne({
      "guild.id": message.guild.id,
    });
    if (previousData) {
      previousData.twentyfourSeven = twentyfourSeven;
      previousData.time = newTime;
      previousData.save();
      return message.channel.send(
        `24/7 status: \`${twentyfourSeven.toString() + ` ${newTime}ms`}\``
      );
    }

    const data = new client.preferences.model({
      guild: { name: message.guild.name, id: message.guild.id },
      twentyfourSeven: twentyfourSeven,
      time: newTime,
    });

    data.save();
    return message.channel.send(
      `24/7 status: \`${twentyfourSeven.toString() + ` ${newTime}ms`}\``
    );
  },
};
