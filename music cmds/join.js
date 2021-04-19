const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "join",
        aliases: ["join", "enter"],
        description: "Melody joins the voice channel!",
        usage: "join",
    },

    run: async function (client, message, args) {
              
        let channel = message.member.voice.channel;

        if (!channel) return sendError("I'm sorry but you need to be in a voice channel!", message.channel);
            
        try {
                const connection = await channel.join();
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return sendError(`I could not join the voice channel: ${error}`, message.channel);
            }
  

const NewEmbed = new MessageEmbed()
           .setColor("RED")
           .setDescription("Please join a voice channel first!")

      if (!message.member.voice.channel) {
        return message.reply(NewEmbed);
    }
        const Embed = new MessageEmbed()
            .setAuthor("")
            .setColor("GREEN")
            .setDescription("Joined the voice channel!")

        return message.channel.send(Embed).catch(() => message.channel.send(""))
    },
};
