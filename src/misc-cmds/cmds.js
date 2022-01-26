const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "commands",
  description: "Basic usage information of the bot",
  usage: "commands",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cmds"],
  example: ["cmds", "commands"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
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
  },

  SlashCommand: {
    /**
     *
     * @param {import("../melodyClient")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    // skipcq
    run: async (client, interaction, args) => {
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
    },
  },
};
