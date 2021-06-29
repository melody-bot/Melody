module.exports = {
  name: "prefix",
  description: "Change server prefix",
  usage: "prefix <newprefix>(optional)",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["pref"],
  example: ["pref", "prefix >>"],
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

    function isPermitted() {
      if (message.member.hasPermission(["MANAGE_GUILD"])) {
        return true;
      } else if (
        message.member.roles.cache.some((role) => role.name === "DJ")
      ) {
        return true;
      } else {
        return false;
      }
    }

    let permission = isPermitted();

    if (permission === false)
      return client.sendError(
        message.channel,
        "Missing Permissions!\n You need the `DJ` role or `MANAGE_GUILD` permission to access this command."
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = await guild.members.fetch(interaction.member.user.id);

      function isPermitted() {
        if (member.hasPermission(["MANAGE_GUILD"])) {
          return true;
        } else if (member.roles.cache.some((role) => role.name === "DJ")) {
          return true;
        } else {
          return false;
        }
      }

      const getPrefix = await client.getPrefix(interaction.guild_id);

      if (!interaction.data.options)
        return interaction.send(
          `This server's prefix is ` + "`" + getPrefix.prefix + "`"
        );

      let permission = isPermitted();

      if (permission === false)
        return client.sendError(
          interaction,
          "Missing Permissions!\n You need the `DJ` or `MANAGE_GUILD` permission to role to access this command."
        );

      let newprefix = interaction.data.options[0].value; // the provided argument. Ex: !changeprefix <newprefix>
      await client.setPrefix(interaction.guild_id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
      return interaction.send(
        `**Successfully changed the prefix from "${getPrefix.prefix}" to "${newprefix}"**`
      );
    },
  },
};
