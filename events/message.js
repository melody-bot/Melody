const mongopref = require("discord-mongodb-prefix");
const mongoose = require('mongoose');
const sendError = require("../util/error")

module.exports = async (client, message) => {
  if (message.author.bot) return;
  
  client.prefix = new Map(); 

  mongopref.setURL("mongodb+srv://kush:qEGVnwOlGGi7dMel@melody.6795r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  client.defaultprefix = process.env.PREFIX;
  
  //Prefixes also have mention match
  const fetchprefix = await mongopref.fetch(client, message.guild.id);
  
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : fetchprefix.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  if(command === "changeprefix"){ /// you can use your command handler to, but look that you overgive the parameters client, message
    if (!message.member.hasPermission(["MANAGE_GUILD"]))
    return sendError("Oops!, looks like you don'have permission to change the prefix, ask an admin to do this!",message.channel);
    else {
    let newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
    await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
    message.channel.send(`**Successfully changed the prefix from "${fetchprefix.prefix}" to "${newprefix}"**`)
    };
    }
  if(command === "prefix"){
    if(!args[0]) return message.channel.send(`This server's prefix is ` +"`" + fetchprefix.prefix+ "`")
    const otherprefix = await mongopref.fetch(client, args[0]);
    return message.channel.send(`This server's prefix is` + " `" + otherprefix.prefix + " .`")
    }

  //Searching a command
  const cmd = client.commands.get(command);
  //Searching a command aliases
  const aliases = client.commands.find(x => x.info.aliases.includes(command))

  //if(message.channel.type === "dm")return message.channel.send("None of the commands work in DMs. So please use commands in server!")
process.on("unhandledRejection", (reason, promise) => {
    try {
        console.error("Unhandled Rejection at: ", promise, "reason: ", reason.stack || reason);
    } catch {
        console.error(reason);
    }
});
require('events').EventEmitter.defaultMaxListeners = 100



  //Executing the codes when we get the command or aliases
  if(cmd){
    cmd.run(client, message, args);
  }else if(aliases){
    aliases.run(client, message, args);
  }else return
};
