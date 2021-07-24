const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "logs",
  description: "To view application logs.",
  usage: "logs",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["log"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    function CheckDeveloper(user_id) {
      return client.config.Developers.includes(user_id) ? true : false;
    }

    const isDeveloper : any = CheckDeveloper(message.author.id);

    if (isDeveloper == false)
      return message.channel.send("Only my developers can use this command.");

    const lines : any = args.join(" ");

    if (!lines) {
      exec(`tail src/client.log`, (error, stdout, stderr) => {
        if (error) {
          const runError : any = new MessageEmbed()
            .setTitle(`Fetching log file . . .`)
            .setDescription(`**Error**: ${error.message}`)
            .setColor("343434");
          return message.channel.send(runError);
        }
        if (stderr) {
          const runStderr : any = new MessageEmbed()
            .setTitle(`Fetching log file . . .`)
            .setDescription(`**Stderr**: ${stderr}`)
            .setColor("343434");

          return message.channel.send(runStderr);
        }
        const output : any = new MessageEmbed()
          .setTitle(`Fetching log file . . .`)
          .setDescription(`**Output**: ${stdout}`)
          .setColor("343434");

        return message.channel.send(output);
      });
      return;
    }
    exec(
      `tail -n ${parseInt(lines, 10)} src/client.log`,
      (error, stdout, stderr) => {
        if (error) {
          const runError : any = new MessageEmbed()
            .setTitle(`Fetching log file . . .`)
            .setDescription(`**Error**: ${error.message}`)
            .setColor("343434");
          return message.channel.send(runError);
        }
        if (stderr) {
          const runStderr : any = new MessageEmbed()
            .setTitle(`Fetching log file . . .`)
            .setDescription(`**Stderr**: ${stderr}`)
            .setColor("343434");

          return message.channel.send(runStderr);
        }
        const output : any = new MessageEmbed()
          .setTitle(`Fetching log file . . .`)
          .setDescription(`**Output**: ${stdout}`)
          .setColor("343434");

        return message.channel.send(output);
      }
    );
  },
};
