const { MessageEmbed } = require("discord.js");

/**
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = async (text, channel) => {
  const embed = new MessageEmbed()
    .setColor("RED")
    .setDescription(
      `**${text}** **|** A bug? [Report it](https://discord.gg/QfZdQynYbg)`
    );
  await channel.send(embed).catch((err) => {
    client.log(err)
  });
};
