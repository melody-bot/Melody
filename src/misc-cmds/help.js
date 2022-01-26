const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Basic usage information of the bot",
  usage: "help",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cmd"],
  example: ["help", "help all", "help play"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    if (args[0] === "all" || args[0] === "list") {
      const getprefix = await client.getPrefix(message.guild.id);
      const prefix = getprefix.prefix;
      const embed = new MessageEmbed().setAuthor(
        "List of all commands with aliases"
      );
      const cmds = client.commands.map(
        (cmd) => `**${prefix}${cmd.name}** — ${cmd.description}`
      );
      embed.setDescription(cmds.join("\n"));
      embed.setFooter(
        "To view detailed information about any command, use the `--help` argument with the command."
      );
      return message.channel.send(embed);
    }

    if (args[0]) {
      const GuildPrefix = await client.getPrefix(message.guild.id);
      const capitalize = (string) =>
        string.charAt(0).toUpperCase() + string.slice(1);
      const cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      const help = new MessageEmbed()
        .setAuthor(`${capitalize(cmd.name)} help`)
        .setDescription(`${cmd.description}`)
        .addField(`Usage`, `\`${GuildPrefix.prefix}${cmd.usage}\``, true)
        .addField(`Aliases`, `\`${cmd.aliases[0] ? cmd.aliases : `--`}\``, true)
        .addField(
          `Example`,
          `\`${GuildPrefix.prefix}${cmd.example[0]}\`\n\`${GuildPrefix.prefix}${cmd.example[1]}\``
        );
      return message.channel.send(help);
    }
    const embed = new MessageEmbed()
      .setAuthor(` ${client.user.username}`, `${client.config.IconURL}`)
      .setColor("343434")
      .setDescription(
        "`.play ['p']` - To play songs! Give the url,\nor just write the song name - `.p <song>`\n\nMelody is a feature-rich music bot with \nall premium features (for free!). To get all\n the information, please check [the wiki.](https://github.com/melody-bot/Melody/wiki)\n\n"
      )

      .addField(
        "**IMPORTANT**",
        `Those who don't find slash commands \nplease re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
          client.config.ClientID
        }&permissions=${
          client.config.Permissions
        }&scope=bot%20${client.config.Scopes.join("%20")})`
      )

      .addField(
        "HELP/SUPPORT",
        `Report bugs in our [Support Server.](${client.config.SupportServer})\nMajor changes being done to the bot\n are in the change log in the \`.about\` cmd.\n If you are a developer, reach out\n to us on [GitHub](https://github.com/melody-bot/Melody)`,
        false
      )

      .setFooter(`Thanks for using Melody! `);

    return message.channel.send(embed);
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Command help",
        value: "scope",
        type: 3,
        required: false,
      },
    ],
    // skipcq
    run: async (client, interaction, args) => {
      if (
        interaction.data.options[0] &&
        (interaction.data.options[0].value === "all" ||
          interaction.data.options[0].value === "list")
      ) {
        const getprefix = await client.getPrefix(interaction.guild_id);
        const prefix = getprefix.prefix;
        const embed = new MessageEmbed().setAuthor(
          "List of all commands with aliases"
        );
        const cmds = client.commands.map(
          (cmd) => `**${prefix}${cmd.name}** — ${cmd.description}`
        );
        embed.setDescription(cmds.join("\n"));
        embed.setFooter(
          "To view detailed information about any command, use the `--help` argument with the command."
        );
        return interaction.send(embed);
      }

      if (interaction.data.options[0].value) {
        const GuildPrefix = await client.getPrefix(interaction.guild_id);
        const capitalize = (string) =>
          string.charAt(0).toUpperCase() + string.slice(1);
        const cmd =
          client.commands.get(interaction.data.options[0].value) ||
          client.commands.find(
            (x) =>
              x.aliases && x.aliases.includes(interaction.data.options[0].value)
          );
        const help = new MessageEmbed()
          .setAuthor(`${capitalize(cmd.name)} help`)
          .setDescription(`${cmd.description}`)
          .addField(`Usage`, `\`${GuildPrefix.prefix}${cmd.usage}\``, true)
          .addField(
            `Aliases`,
            `\`${cmd.aliases[0] ? cmd.aliases : `--`}\``,
            true
          )
          .addField(
            `Example`,
            `\`${GuildPrefix.prefix}${cmd.example[0]}\`\n\`${GuildPrefix.prefix}${cmd.example[1]}\``
          );
        return interaction.send(help);
      }

      const embed = new MessageEmbed()
        .setAuthor(` ${client.user.username}`, `${client.config.IconURL}`)
        .setColor("343434")
        .setDescription(
          "`.play ['p']` - To play songs! Give the url,\nor just write the song name - `.p <song>`\n\nMelody is a feature-rich music bot with \nall premium features (for free!). To get all\n the information, please check [the wiki.](https://github.com/melody-bot/Melody/wiki)\n\n"
        )

        .addField(
          "**IMPORTANT**",
          `Those who don't find slash commands \nplease re-invite the bot using [this link](https://discord.com/oauth2/authorize?client_id=${
            client.config.ClientID
          }&permissions=${
            client.config.Permissions
          }&scope=bot%20${client.config.Scopes.join("%20")})`
        )

        .addField(
          "HELP/SUPPORT",
          `Report bugs in our [Support Server.](${client.config.SupportServer})\nMajor changes being done to the bot\n are in the change log in the \`.about\` cmd.\n If you are a developer, reach out\n to us on [GitHub](https://github.com/melody-bot/Melody)`,
          false
        )

        .setFooter(`Thanks for using Melody! `);

      return interaction.send(embed);
    },
  },
};
