const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info : {
        name: "clearqueue",
        description: "To clear the server queue",
        usage: "clearqueue",
        aliases: ["cq", "clearqueue", "skipall"]

    },

    run: async function (client, message, args) {

        const lol = new MessageEmbed()
        .setDescription("**Cleared the server song queue!\n**Use `.play` to add new songs to the queue.")
        
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!message.member.hasPermission(["MANAGE_GUILD"]))
        return sendError("Oops!, looks like you don'have permission to clear the queue, ask a moderator to do this!",message.channel);

        else serverQueue.connection.dispatcher.end()
        message.client.queue.delete(message.guild.id);
        await message.channel.send(lol)

        if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
        
        try{}
        catch (error) {
            return sendError(`An unexpected error has occurred: ${error}`, message.channel.send)
        }

        
        
     
    }

};