const mongopref = require("discord-mongodb-prefix");

/**
 *
 * @param {require("../melodyClient")} client
 * @param {require("discord.js").Message} message
 * @returns {void}
 */

// skipcq
module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  mongopref.setURL(`${client.config.mongoURL}`);

  client.defaultprefix = client.config.DefaultPrefix;

  const fetchprefix = await mongopref.fetch(client, message.guild.id);

  //Prefixes also have mention match
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `, "u");
  const prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : fetchprefix.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/gu);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  //Searching a command
  const cmd =
    client.commands.get(command) ||
    client.commands.find((x) => x.aliases && x.aliases.includes(command));

  function isDJ() {
    return message.member.roles.cache.some((role) => role.name === "DJ")
      ? true
      : false;
  }

  function hasPermission() {
    return cmd.permissions &&
      cmd.permissions.member &&
      message.channel.permissionsFor(message.member).has(cmd.permissions.member)
      ? true
      : false;
  }

  function isAdmin() {
    return message.channel.permissionsFor(message.member).has(["ADMINISTRATOR"])
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

    cmd.run(client, message, args);
  } else return;
};
