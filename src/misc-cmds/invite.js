const { MessageEmbed } = require("discord.js");
const disbut = require("discord-buttons");

module.exports = {
  name: "invite",
  description: "To add/invite the bot to your server.",
  usage: "invite",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["inv"],
  example: ["inv", "invite"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const button = new disbut.MessageButton()
      .setLabel("Invite Melody!")
      .setUrl(
        "https://discord.com/oauth2/authorize?client_id=809283972513267752&permissions=2163734592&scope=bot%20applications.commands"
      )
      .setStyle("url");

    let invite = new MessageEmbed()
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(
        `Want me in your server? Invite me using the link above! \n\n`
      )
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${
          client.config.ClientID
        }&permissions=${
          client.config.Permissions
        }&scope=bot%20${client.config.Scopes.join("%20")}`
      )
      .setColor("BLUE")
      .setFooter("You can also use the new button feature below!");

    return message.channel.send(invite, button);
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Command help",
        value: "command",
        type: 3,
        required: false,
      },
    ],
    // skipcq
    run: async (client, interaction, args) => {
      const sbutton = new disbut.MessageButton()
        .setLabel("Invite Melody!")
        .setUrl(
          "https://discord.com/oauth2/authorize?client_id=809283972513267752&permissions=2163734592&scope=bot%20applications.commands"
        )
        .setStyle("url");

      let invite = new MessageEmbed()
        .setTitle(`Invite ${client.user.username}`)
        .setDescription(
          `Want me in your server? Invite me using the link above! \n\n`
        )
        .setURL(
          `https://discord.com/oauth2/authorize?client_id=${
            client.config.ClientID
          }&permissions=${
            client.config.Permissions
          }&scope=bot%20${client.config.Scopes.join("%20")}&redirect_url=${
            client.config.Website
          }${client.config.CallbackURL}&response_type=code`
        )
        .setColor("BLUE");
      return interaction.send(invite, sbutton);
    },
  },
};
