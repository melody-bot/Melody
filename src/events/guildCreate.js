const { Discord, MessageEmbed } = require("discord.js")

module.exports = async (client, guild) => {
  require("../util/slashCommands")(client, guild.id);

    const embed = new MessageEmbed()
    .setDescription("Thanks for inviting me! Use `.help` to get more info on all the commands.")

    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES' && 'VIEW_CHANNEL'))

    channel.send(embed);
};
