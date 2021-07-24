const { MessageEmbed } = require("discord.js");
const sendError : any = require("../util/error");
/**
 *
 * @param {require("../melodyClient")} client
 * @param {require("discord.js").Message} message
 * @returns {void}
 */

// skipcq
module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  const GuildPrefix : any = await client.getPrefix(message.guild.id);

  //Prefixes also have mention match
  const prefixMention : any = new RegExp(`^<@!?${client.user.id}> `, "u");
  const prefix : any = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : GuildPrefix.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const cmdArray : any = message.content.split(" && ");

  if (cmdArray.length > 3)
    return sendError(
      "I can only process a maximum of 3 commands per message.",
      message.channel
    );

  async function runCmd(item) {
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const args : any = item.slice(prefix.length).trim().split(/ +/gu);
    //Making the command lowerCase because our file name will be in lowerCase
    const command : any = args.shift().toLowerCase();

    //Searching a command
    const cmd : any =
      client.commands.get(command) ||
      client.commands.find((x) => x.aliases && x.aliases.includes(command));

    if (args[0] === "--help") {
      const help : any = new MessageEmbed()
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
      const channelPermission : any = channelPerms();
      const admin : any = isAdmin();
      const permissions : any = hasPermission();
      const DJ : any = isDJ();

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
