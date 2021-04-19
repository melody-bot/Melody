const mongopref = require("discord-mongodb-prefix");

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
    const fetchprefix = await mongopref.fetch(client, message.guild.id);

    if (!args[0])
      return message.channel.send(
        `This server's prefix is \`${fetchprefix.prefix}\``
      );

    const newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
    await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
    message.channel.send(
      `**Successfully changed the prefix from "${fetchprefix.prefix}" to "${newprefix}"**`
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
      // const fetchprefix = await mongopref.fetch(client, interaction.guild_id);

      // if (!args)
      //     return interaction.send(
      //         `This server's prefix is ` + "`" + fetchprefix.prefix + "`"
      //     );

      // let newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
      // await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
      // interaction.send(
      //     `**Successfully changed the prefix from "${fetchprefix.prefix}" to "${newprefix}"**`
      // );

      return interaction.send(
        `Slash command under development. Use .prefix for an alternative.`
      );
    },
  },
};
