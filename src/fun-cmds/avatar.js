const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "avatar",
  description: "To show the avatar/profile picture of a user",
  usage: "avatar",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["av"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor("343434")
      .setAuthor(`Avatar of ${message.author.tag}!`)
      .setImage(
        `${message.author.displayAvatarURL({ dynamic: true, size: 1024 })}`
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.avatarURL()
      );

    if (!message.mentions.users.size) {
      return message.channel.send(embed);
    }

    let user = message.mentions.users.first() || message.author;
    const embed2 = new MessageEmbed()
      .setColor("343434")
      .setAuthor(`Avatar of ${user.tag}!`)
      .setImage(`${user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.avatarURL()
      );
    return message.channel.send(embed2);
  },
  SlashCommand: {
    // skipcq
    run: async (client, interaction, args) => {
      const getPrefix = await client.getPrefix(interaction.guild_id)

      return interaction.send(
        `Slash Command under development, use ${getPrefix.prefix}avatar for an alternative.`
      );
      //   let user = client.users.cache.get(interaction.member.user.id);
      //   const embed = new MessageEmbed()
      //   .setColor("343434")
      //   .setAuthor(`Avatar of ${user.tag}!`)
      //   .setImage(`${user.displayAvatarURL({dynamic:true, size:1024 })}`)
      //   .setFooter(`Requested by ${user.tag}`, user.avatarUxRL())

      //   if (!message.mentions.users.size) {
      //     return interaction.send(embed)
      //   }

      //   const user = message.mentions.users.first() || message.author
      //   const embed2 = new MessageEmbed()
      //     .setColor("343434")
      //     .setAuthor(`Avatar of ${user.tag}!`)
      //     .setImage(`${user.displayAvatarURL({dynamic: true, size:1024})}`)
      //     .setFooter(`Requested by ${user.tag}`, user.avatarURL())
      //   return interaction.send(embed2);
    },
  },
};
