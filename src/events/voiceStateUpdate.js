const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldState) => {
  let player = client.Manager.get(oldState.guild.id);

  const voiceChannel = client.channels.cache.get(oldState.channelID);

  if (player && voiceChannel && voiceChannel.members.size === 1) {
    player.pause(true);
    const textChannel = client.channels.cache.get(player.textChannel);
    const paused = new MessageEmbed().setDescription(
      "Paused the music as nobody is in the voice channel"
    );
    return textChannel.send(paused);
  }
};
