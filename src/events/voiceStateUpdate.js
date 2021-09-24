const { MessageEmbed } = require("discord.js");
module.exports = async (client, oldState) => {
  let player = client.Manager.get(oldState.guild.id);

  const voiceChannel = client.channels.cache.get(oldState.channelID);

  if (player && voiceChannel && voiceChannel.members.size === 1) {
    player.pause(true);
    const textChannel = await client.channels.fetch(player.textChannel);
    const paused = new MessageEmbed().setDescription(
      "Paused the music as nobody is in the voice channel"
    );
    textChannel.send(paused);
    const preference = await client.preferences.model.findOne({
      "guild.id": oldState.guild.id,
    });
    if (!preference.twentyfourSeven) {
      const time = preference.time ?? 300000;
      setTimeout(() => {
        player.destroy();
        const ended = new MessageEmbed().setDescription(
          `Player left after waiting for ${time}ms`
        );
        textChannel.send(ended);
      }, time);
    }
  }
};
