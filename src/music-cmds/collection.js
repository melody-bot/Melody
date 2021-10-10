const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const sendError = require("../util/error");
const sendSuccess = require("../util/success");
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
    // Send error if no arguments given
    if (!args[0])
      return sendError(
        "You must provide some argument to run this command.",
        message.channel
      );

    // Get the collections database
    const database = client.collections;

    // Switch 1st argument for different commands
    switch (args[0]) {
      // New collection
      case "new": {
        // Get existing collections first (for guilds)
        if (args[1] === "guild") {
          const collections = await database.model.find({
            "user.id": message.guild.id,
            "user.type": 1,
          });

          // Check if guild collection exceeds limit
          if (collections.length === 2)
            return sendError(
              "This server has reached the limit of 2 collections",
              message.channel
            );

          // Send error if no collection name is given
          if (!args[2])
            return sendError(
              "You must provide a name to create a collection",
              message.channel
            );

          // Only alphanumeric characters allowed in the name
          const name = args[2].replace(/[^a-z0-9]/gi, "");

          // Send error if a collection with the same name already exists with the user
          if (collections.some((collection) => collection.name === name))
            return sendError(
              `This server already has a collection named \`${name}\``,
              message.channel
            );

          // Create new collection mongoose model
          const newCollection = new database.model({
            name: name,
            user: { type: 1, id: message.guild.id, name: message.guild.name },
            songs: [],
          });

          // Save the collection
          newCollection.save((err) => {
            if (err) return console.log(err);
          });
          return sendSuccess(
            `Created new server collection \`${name}\`.`,
            message.channel
          );
        }

        // Get existing collections first (personal)
        const collections = await database.model.find({
          "user.id": message.author.id,
          "user.type": 0,
        });

        // Check if personal collection exceeds limit
        if (collections.length === 5)
          return sendError(
            "You have reached your limit of 5 collections",
            message.channel
          );

        // Send error if no collection name if given
        if (!args[1])
          return sendError(
            "You must provide a name to create a collection",
            message.channel
          );

        // Only alphanumeric characters are allowed in the name
        const name = args[1].replace(/[^a-z0-9]/gi, "");

        // Send error if a collection with the name already exists
        if (collections.some((collection) => collection.name === name))
          return sendError(
            `You already have a collection named \`${name}\``,
            message.channel
          );

        // Create new collection mongoose model
        const newCollection = new database.model({
          name: name,
          user: { type: 0, id: message.author.id, name: message.author.tag },
          songs: [],
        });

        // Save the collection
        newCollection.save((err) => {
          if (err) return console.log(err);
        });
        return sendSuccess(
          `Created new personal collection \`${name}\`.`,
          message.channel
        );
      }
      // List collections
      case "list": {
        // Run mongoose query to find user's collections
        let collections = await database.model
          .find({
            "user.id": message.author.id,
            "user.type": 0,
          })
          .sort([["date", -1]]);

        // Find guild collections if specified
        if (args[1] === "guild")
          collections = await database.model
            .find({
              "user.id": message.guild.id,
              "user.type": 1,
            })
            .sort([["date", -1]]);

        // Send error if no collections exist for user
        if (collections.lenght === 0)
          return sendError(
            "You don't have any collections yet!",
            message.channel
          );

        // Map collections with their index
        const Collections = collections.map((collection, index) => {
          collection.index = index;
          return collection;
        });

        // Map collections to make the description for embed
        const description = Collections.map(
          (collection) =>
            `**${collection.name}**:  \`${collection.songs.length}\` items`
        ).join("\n");

        // Create message embed
        const embed = new MessageEmbed()
          .setColor("343434")
          .setDescription(description)
          .setAuthor("Collections", client.config.IconURL);

        // Send the embed
        if (args[1] === "guild") return message.channel.send(embed);
        const user = client.users.cache.get(message.member.user.id);
        try {
          await message.react("✅");
          return user.send(embed);
        } catch {
          return sendError("Your DMs are disabled", message.channel);
        }
      }
      // Delete collections
      case "delete": {
        // Replace special characters to get alphanumeric string
        let name = args[1].replace(/[^a-z0-9]/gi, "");

        // For guild collections
        if (args[1] === "guild") {
          name = args[2].replace(/[^a-z0-9]/gi, "");
          await database.model.deleteOne(
            {
              "user.id": message.guild.id,
              "user.type": 1,
              name: name,
            },
            (err) => {
              if (err) return client.log(err);
            }
          );
          return sendSuccess(
            `Deleted collection \`${name}\` successfully.`,
            message.channel
          );
        }

        // For personal collections
        await database.model.deleteOne(
          {
            "user.id": message.author.id,
            "user.type": 0,
            name: name,
          },
          (err) => {
            if (err) return client.log(err);
          }
        );
        return sendSuccess(
          `Deleted collection \`${name}\` successfully.`,
          message.channel
        );
      }
      // Default argument, .i.e., collection name
      default: {
        let name = args[0].replace(/[^a-z0-9]/gi, "");

        // Get the collection from the database
        let collection = await database.model.findOne({
          "user.id": message.author.id,
          "user.type": 0,
          name: name,
        });

        // If argument specifies guild scope
        if (args.includes("guild")) {
          const index = args.indexOf("guild");
          if (index > -1) args.splice(index, 1);

          // Get the guild collection
          // skipcq
          name = args[0].replace(/[^a-z0-9]/gi, "");
          collection = await database.model.findOne({
            "user.id": message.guild.id,
            "user.type": 1,
            name: name,
          });
        }

        // Send error if no collection found
        if (!collection)
          return sendError(
            `Couldn't find any collection \`${name}\``,
            message.channel
          );

        // Switch collection specific arguments
        switch (args[1]) {
          // Adding songs
          case "add": {
            // Send error if collection already contains 50 songs
            if (collection.songs.length === 50)
              return sendError(
                "Cannot add more than 50 songs per collection",
                message.channel
              );

            // Get song name/url
            const songArray = args.slice(2);
            const search = songArray.join(" ");

            // Send error if no name/url given
            if (!search)
              return sendError("You didn't tell what to add!", message.channel);

            // Get song metadata
            const getSongs = async (SearchString) => {
              const player = client.Manager.create({
                guild: message.guild.id,
                voiceChannel: null,
                textChannel: message.channel.id,
                selfDeafen: false,
              });
              if (SearchString.match(client.Lavasfy.spotifyPattern)) {
                player.destroy();
                return { name: "Spotify Playlist", url: SearchString };
              }
              const Searched = await player.search(
                SearchString,
                message.author
              );
              player.destroy();
              return Searched.loadType == "PLAYLIST_LOADED"
                ? { name: "YouTube Playlist", url: SearchString }
                : {
                    name: Searched.tracks[0].title,
                    url: Searched.tracks[0].uri,
                  };
            };

            // Add current song to collection
            if (args[2] === "current") {
              const player = client.Manager.get(message.guild.id);

              // Send error if no song is playing
              if (!player)
                return sendError(
                  "There is nothing playing in this server.",
                  message.channel
                );

              // Add song to collection
              await collection.songs.push({
                name: player.queue.current.title,
                url: player.queue.current.uri,
              });
              collection.save((err) => {
                if (err) return console.log(err);
              });
              return sendSuccess(`Added item to \`${name}\``, message.channel);
            }

            // Get the requested song
            const item = await getSongs(search);

            // Save the song to collection
            await collection.songs.push(item);
            collection.save((err) => {
              if (err) return console.log(err);
            });
            return sendSuccess(`Added item to \`${name}\``, message.channel);
          }
          // List songs in a collection
          case "list": {
            // Send error if no songs are there in the collection
            if (collection.songs.length === 0)
              return sendError(
                "You haven't added any songs in this collection yet!",
                message.channel
              );

            // Map songs to with their index
            const songs = collection.songs.map((song, index) => {
              song.index = index;
              return song;
            });

            // Create chunks of 20 songs
            const ChunkedSongs = _.chunk(songs, 20);

            // Create pages
            const Pages = ChunkedSongs.map((Songs) => {
              // Map songs to create embed description
              const SongsDescription = Songs.map(
                (song) => `**${song.index + 1})**  [${song.name}](${song.url})`
              ).join("\n");
              const Embed = new MessageEmbed()
                .setAuthor(`${name}`, client.config.IconURL)
                .setColor("343434")
                .setDescription(SongsDescription);
              return Embed;
            });

            // Send embed
            if (!Pages.length || Pages.length === 1)
              return message.channel.send(Pages[0]);
            return client.Pagination(message, Pages);
          }
          // Delete songs from collection
          case "delete": {
            // Get the song to delete
            const deleteIndex = parseInt(args[2], 10);
            if (deleteIndex < 0 || deleteIndex > collection.songs.length)
              return sendError("Invalid index", message.channel);
            const deletedSong = collection.songs[deleteIndex - 1].name;

            // Remove the song
            await collection.songs.splice(deleteIndex - 1, 1);
            collection.save((err) => {
              if (err) return console.log(err);
            });
            return sendSuccess(
              `Deleted \`${deletedSong}\` from \`${name}\``,
              message.channel
            );
          }
          // Play items from collection
          case "play": {
            // Player requirements
            if (!message.member.voice.channel)
              return sendError(
                "You must be in a voice channel to play something!",
                message.channel
              );
            if (
              message.guild.me.voice.channel &&
              message.guild.me.voice.channel != message.member.voice.channel
            )
              return sendError(
                `You must be in ${message.guild.me.voice.channel} to use this command.`,
                message.channel
              );
            const CheckNode = () => {
              client.Manager.
              client.Manager.nodes.get(
                client.config.Lavalink[0].id
              );
            }
            if (!CheckNode || !CheckNode.connected) {
              return sendError("Server under maintenance.", message.channel);
            }

            // New player
            const player = client.Manager.create({
              guild: message.guild.id,
              voiceChannel: message.member.voice.channel.id,
              textChannel: message.channel.id,
              selfDeafen: false,
            });
            if (player.state != "CONNECTED") player.connect();

            // If all items to be played
            if (args[2] === "all") {
              // Add song/playlists to queue
              await collection.songs.forEach(async (song) => {
                if (song.url.match(client.Lavasfy.spotifyPattern)) {
                  await client.Lavasfy.requestToken();
                  const node = client.Lavasfy.nodes.get(
                    client.config.Lavalink[0].id
                  );
                  const Searched = await node.load(song.url);
                  if (Searched.loadType === "PLAYLIST_LOADED") {
                    const songs = [];
                    for (let i = 0; i < Searched.tracks.length; i++)
                      songs.push(
                        TrackUtils.build(Searched.tracks[i], message.author)
                      );
                    player.queue.add(songs);
                  } else if (Searched.loadType.startsWith("TRACK")) {
                    player.queue.add(TrackUtils.build(Searched.tracks[0]));
                  }
                } else {
                  const Searched = await player.search(
                    song.url,
                    message.author
                  );
                  if (Searched.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(Searched.tracks);
                  } else {
                    player.queue.add(Searched.tracks[0]);
                  }
                }
                if (!player.playing && !player.paused) return player.play();
              });
              return;
            }

            // If a specific song to be played
            const songIndex = parseInt(args[2], 10);
            if (songIndex < 0 || songIndex > collection.songs.length)
              return sendError("Invalid index", message.channel);

            // Get song from collection
            const song = collection.songs[songIndex - 1];

            // Add to queue
            if (song.url.match(client.Lavasfy.spotifyPattern)) {
              await client.Lavasfy.requestToken();
              const node = client.Lavasfy.nodes.get(
                client.config.Lavalink[0].id
              );
              const Searched = await node.load(song.url);
              if (Searched.loadType === "PLAYLIST_LOADED") {
                const songs = [];
                for (let i = 0; i < Searched.tracks.length; i++)
                  songs.push(
                    TrackUtils.build(Searched.tracks[i], message.author)
                  );
                player.queue.add(songs);
              } else if (Searched.loadType.startsWith("TRACK")) {
                player.queue.add(TrackUtils.build(Searched.tracks[0]));
              }
            } else {
              const Searched = await player.search(song.url, message.author);
              if (Searched.loadType == "PLAYLIST_LOADED") {
                player.queue.add(Searched.tracks);
              } else {
                player.queue.add(Searched.tracks[0]);
              }
            }
            if (!player.playing && !player.paused) return player.play();
            return;
          }
          // Send error if argument doesn't match any of the above possibilities
          default: {
            return sendError(
              "No such command for collections.",
              message.channel
            );
          }
        }
      }
    }
  },
};
