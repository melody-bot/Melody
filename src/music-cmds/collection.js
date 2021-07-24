const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const sendError = require("../util/error");
const _ = require("lodash");

module.exports = {
  name: "collection",
  description: "View and manage your collections",
  usage: "collection show/list/add/new/remove <song/collection name>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["playlist"],
  example: ["collection list all", "collection add --current favourites"],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
    const database = client.collections;
    switch (args[0]) {
      case "new":
        if (args[1] === "guild") {
          const collections = await database.model.find({
            "user.id": message.guild.id,
            "user.type": 1,
          });
          if (collections.length === 2)
            return sendError(
              "This server has reached the limit of 2 collections",
              message.channel
            );
          if (!args[2])
            return sendError(
              "You must provide a name to create a collection",
              message.channel
            );
          const name = args[2].replace(/[^a-z0-9]/gi, "");
          if (collections.some((collection) => collection.name === name))
            return sendError(
              `This server already has a collection named \`${name}\``,
              message.channel
            );
          const Collection = new database.model({
            name: name,
            user: { type: 1, id: message.guild.id, name: message.guild.name },
            songs: [],
          });
          Collection.save((err) => {
            if (err) return console.log(err);
          });
          return message.channel.send(
            `Created new server collection \`${name}\`.`
          );
        }
        const collections = await database.model.find({
          "user.id": message.author.id,
          "user.type": 0,
        });
        if (collections.length === 5)
          return sendError(
            "You have reached your limit of 5 collections",
            message.channel
          );
        if (!args[1])
          return sendError(
            "You must provide a name to create a collection",
            message.channel
          );
        const name = args[1].replace(/[^a-z0-9]/gi, "");
        if (collections.some((collection) => collection.name === name))
          return sendError(
            `You already have a collection named \`${name}\``,
            message.channel
          );
        const Collection = new database.model({
          name: name,
          user: { type: 0, id: message.author.id, name: message.author.tag },
          songs: [],
        });
        Collection.save((err) => {
          if (err) return console.log(err);
        });
        return message.channel.send(
          `Created new personal collection \`${name}\`.`
        );
      case "list":
        let results = await database.model
          .find({
            "user.id": message.author.id,
            "user.type": 0,
          })
          .sort([["date", -1]]);
        if (args[1] === "guild")
          results = await database.model
            .find({
              "user.id": message.guild.id,
              "user.type": 1,
            })
            .sort([["date", -1]]);
        const Collections = results.map((collection, index) => {
          collection.index = index;
          return collection;
        });
        const description = Collections.map(
          (collection) =>
            `**${collection.name}**:  \`${collection.songs.length}\` items`
        ).join("\n");
        const embed = new MessageEmbed()
          .setColor("343434")
          .setDescription(description)
          .setAuthor("Collections", client.config.IconURL);
        if (args[1] === "guild") return message.channel.send(embed);
        const user = client.users.cache.get(message.member.user.id);
        try {
          await message.react("✅");
          return user.send(embed);
        } catch {
          return sendError("Your DMs are disabled", message.channel);
        }
      case "delete":
        let collection = args[1].replace(/[^a-z0-9]/gi, "");
        if (args[1] === "guild") {
          collection = args[2].replace(/[^a-z0-9]/gi, "");
          await database.model.deleteOne(
            {
              "user.id": message.guild.id,
              "user.type": 1,
              name: collection,
            },
            (err) => {
              if (err) return client.log(err);
            }
          );
          return message.channel.send(
            `Deleted collection \`${collection}\` successfully.`
          );
        }
        await database.model.deleteOne(
          {
            "user.id": message.author.id,
            "user.type": 0,
            name: collection,
          },
          (err) => {
            if (err) return client.log(err);
          }
        );
        return message.channel.send(
          `Deleted collection \`${collection}\` successfully.`
        );
    }
  },
};
