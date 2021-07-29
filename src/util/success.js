const { MessageEmbed } = require("discord.js");

/**
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = async (text, channel) => {
  const embed = new MessageEmbed().setColor("GREEN").setDescription(text);
  await channel.send(embed).catch((err) => {
    if (err) client.log(`util/success.js` + err);
  });
};
