const { MessageEmbed } = require("discord.js");

/**
 *
 * @param {require("../melodyClient")} client
 * @param {require("discord.js").Message} message
 * @returns {void}
 */

// skipcq
module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  const GuildPrefix = await client.getPrefix(message.guild.id);

  //Prefixes also have mention match
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `, "u");
  const prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : GuildPrefix.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const cmdArray = message.content.split(" && ");

  async function runCmd(item) {
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const args = item.slice(prefix.length).trim().split(/ +/gu);
    //Making the command lowerCase because our file name will be in lowerCase
    const command = args.shift().toLowerCase();

    //Searching a command
    const cmd =
      client.commands.get(command) ||
      client.commands.find((x) => x.aliases && x.aliases.includes(command));

    if (args[0] === "--help") {
      const help = new MessageEmbed()
        .setAuthor(`${capitalize(cmd.name)} help`)
        .setDescription(`${cmd.description}`)
        .addField(`Usage`, `\`${GuildPrefix.prefix}${cmd.usage}\``, true)
        .addField(`Aliases`, `\`${cmd.aliases}\``, true)
        .addField(
          `Example`,
          `\`${GuildPrefix.prefix}${cmd.example[0]}\`\n\`${GuildPrefix.prefix}${cmd.example[1]}\``
        );
      return message.channel.send(help);
    }

    function isDJ() {
      return message.member.roles.cache.some((role) => role.name === "DJ")
        ? true
        : false;
    }

    function hasPermission() {
      return cmd.permissions &&
        cmd.permissions.member &&
        message.channel
          .permissionsFor(message.member)
          .has(cmd.permissions.member)
        ? true
        : false;
    }

    function isAdmin() {
      return message.channel
        .permissionsFor(message.member)
        .has(["ADMINISTRATOR"])
        ? true
        : false;
    }

    function channelPerms() {
      return cmd.permissions &&
        cmd.permissions.channel &&
        message.channel.permissionsFor(client.user).has(cmd.permissions.channel)
        ? true
        : false;
    }

    //Executing the codes when we get the command or aliases
    if (cmd) {
      const channelPermission = channelPerms();
      const admin = isAdmin();
      const permissions = hasPermission();
      const DJ = isDJ();

      if (
        channelPermission === false ||
        (permissions === false && admin === false && DJ === false)
      )
        return client.sendError(
          message.channel,
          `Missing Permissions!\n You need the \`DJ\` role or \`${cmd.permissions.member}\` permission to access this command.`
        );
      try {
        cmd.run(client, message, args);
      } catch (e) {
        client.log(e);
      }
    } else return;
  }

  cmdArray.reverse().forEach(runCmd);
};
