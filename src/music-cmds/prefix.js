module.exports = {
  name: "prefix",
  description: "Change server prefix",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["MANAGE_GUILD"],
  },
  aliases: ["p"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async function (client, message, args) {
    const getPrefix = await client.getPrefix(message.guild.id);
    if (!args[0])
      return message.channel.send(
        `This server's prefix is \`${getPrefix.prefix}\``
      );

    const newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
    await client.setPrefix(message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
    message.channel.send(
      `**Successfully changed the prefix from "${getPrefix.prefix}" to "${newprefix}"**`
    );
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        value: "prefix",
        type: 3,
        required: false,
        description: "Change the server prefix",
      },
    ],
    /**
     *
     * @param {import("../melodyClient")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    // skipcq
    run: async function (client, interaction, args) {
      const getPrefix = await client.getPrefix(interaction.guild_id);

      if (!interaction.data.options)
        return interaction.send(
          `This server's prefix is ` + "`" + getPrefix.prefix + "`"
        );

      let newprefix = interaction.data.options[0].value; // the provided argument. Ex: !changeprefix <newprefix>
      await client.setPrefix(interaction.guild_id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
      return interaction.send(
        `**Successfully changed the prefix from "${getPrefix.prefix}" to "${newprefix}"**`
      );
    },
  },
};
