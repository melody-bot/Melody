const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldState, newState) => {
  let player = client.Manager.get(oldState.guild.id);

  const voiceChannel = client.channels.cache.get(oldState.channelID);

  if (
    newState.channel ||
    oldState.channelID !== oldState.guild.me.voice.channelID
  ) {
    player = client.Manager.get(newState.guild.id);
    if (!player) return;
    if (player.paused === false) return;
    player.pause(false);
    const textChannel = client.channels.cache.get(player.textChannel);
    const resumed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription("Resumed the music!");
    return textChannel.send(resumed);
  }
  if (voiceChannel.members.size === 1) {
    player.pause(true);
    const textChannel = client.channels.cache.get(player.textChannel);
    const paused = new MessageEmbed().setDescription(
      "Paused the music as nobody is in the voice channel"
    );
    textChannel.send(paused);
  }
};
