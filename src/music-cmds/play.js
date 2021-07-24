const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const prettyMilliseconds: any = require("pretty-ms");
const sendError: any = require("../util/error");

module.exports = {
  name: "play",
  description: "Play your favorite songs/playlists",
  usage: "play <song>/<url>;; <song2>/<url>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["p"],
  example: [
    "play lenka everything;; faded",
    "p https://www.youtube.com/watch?v=eE9tV1WGTgE",
  ],
  /**
   *
   * @param {import("../melodyClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  // skipcq
  run: async (client, message, args) => {
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

    const search: any = args.join(" ");

    if (!search)
      return sendError(
        "You didn't provide what you want me to play",
        message.channel
      );

    const SongArray: any = search.split(";; ");

    if (SongArray.length > 5)
      return sendError(
        "You can add a maximum of 5 songs per command.",
        message.channel
      );

    async function loadSongs(item) {
      let SearchString: any = item;

      const CheckNode: any = client.Manager.nodes.get(
        client.config.Lavalink.id
      );
      if (!CheckNode || !CheckNode.connected) {
        return sendError("Server under maintenance.", message.channel);
      }
      const player: any = client.Manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: false,
      });

      const SongAddedEmbed: any = new MessageEmbed().setColor("343434");

      if (
        player.queue &&
        message.channel !== client.channels.cache.get(player.textChannel)
      )
        return sendError(
          `The player is already initialized in ${client.channels.cache.get(
            player.textChannel
          )}, use commands over there or use .leave to stop the current player.`,
          message.channel
        );

      if (player.state != "CONNECTED") await player.connect();

      try {
        if (SearchString.match(client.Lavasfy.spotifyPattern)) {
          await client.Lavasfy.requestToken();
          const node: any = client.Lavasfy.nodes.get(client.config.Lavalink.id);
          const Searched: any = await node.load(SearchString);

          if (Searched.loadType === "PLAYLIST_LOADED") {
            const songs: null[] = [];
            for (let i: number = 0; i < Searched.tracks.length; i++)
              songs.push(TrackUtils.build(Searched.tracks[i], message.author));
            player.queue.add(songs);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === Searched.tracks.length
            ) {
              message.channel.send(`Playlist added to queue`);
              return player.play();
            } else {
              SongAddedEmbed.setAuthor(`Playlist added to queue`);
              SongAddedEmbed.addField(
                "Enqueued",
                `\`${Searched.tracks.length}\` songs`,
                false
              );
              //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
              return message.channel.send(SongAddedEmbed);
            }
          } else if (Searched.loadType.startsWith("TRACK")) {
            player.queue.add(
              TrackUtils.build(Searched.tracks[0], message.author)
            );

            if (!player.playing && !player.paused && !player.queue.size) {
              message.channel.send(`Song added to queue`);
              return player.play();
            } else {
              SongAddedEmbed.setAuthor(`Song added to queue`);
              SongAddedEmbed.setDescription(
                `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
              );
              SongAddedEmbed.addField(
                "Duration",
                `${prettyMilliseconds(Searched.tracks[0].duration, {
                  colonNotation: true,
                })} min`,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Queue position",
                  `${player.queue.size - 0}`,
                  true
                );
              return message.channel.send(SongAddedEmbed);
            }
          } else {
            return sendError(
              `No matches found for - ${SearchString} \nNote: Podcasts are not supported`,
              message.channel
            );
          }
        } else {
          const Searched: any = await player.search(
            SearchString,
            message.author
          );
          if (!player)
            return sendError(
              "Nothing is playing right now...",
              message.channel
            );

          if (Searched.loadType === "NO_MATCHES")
            return sendError(
              `No matches found for - ${SearchString} \nNote: Podcasts are not supported`,
              message.channel
            );
          else if (Searched.loadType == "PLAYLIST_LOADED") {
            player.queue.add(Searched.tracks);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === Searched.tracks.length
            ) {
              message.channel.send(`Playlist added to queue`);
              return player.play();
            } else {
              SongAddedEmbed.setAuthor(`Playlist added to queue`);
              SongAddedEmbed.addField(
                "Enqueued",
                `\`${Searched.tracks.length}\` songs`,
                false
              );
              //SongAddedEmbed.setFooter(`Playlist duration \`${prettyMilliseconds(Searched.playlist.duration, { colonNotation: true })}\``);
              return message.channel.send(SongAddedEmbed);
            }
          } else {
            player.queue.add(Searched.tracks[0]);

            if (!player.playing && !player.paused && !player.queue.size) {
              message.channel.send(`Song added to queue`);
              return player.play();
            } else {
              SongAddedEmbed.setAuthor(`Song added to queue`);
              SongAddedEmbed.setDescription(
                `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
              );
              SongAddedEmbed.addField(
                "Duration",
                `${prettyMilliseconds(Searched.tracks[0].duration, {
                  colonNotation: true,
                })} min`,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Queue position",
                  `${player.queue.size - 0}`,
                  true
                );
              return message.channel.send(SongAddedEmbed);
            }
          }
        }
      } catch (e) {
        client.log(e);
        return sendError(
          `There was an error while playing ${SearchString}`,
          message.channel
        );
      }
    }
    SongArray.reverse().forEach(loadSongs);
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        required: true,
        description: "Play music in the voice channel",
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
    run: async (client, interaction, args) => {
      const guild: any = client.guilds.cache.get(interaction.guild_id);
      const member: any = guild.members.cache.get(interaction.member.user.id);
      const channel: any = client.channels.cache.get(interaction.channel_id);

      try {
        if (!member.voice.channel)
          return sendError(
            "You must be in a voice channel to play something!",
            interaction
          );
      } catch (e) {
        return sendError(
          "You must be in a voice channel to play something!",
          interaction
        );
      }

      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return sendError(
          `You must be in ${guild.me.voice.channel} to use this command.`,
          interaction
        );

      const CheckNode: any = client.Manager.nodes.get(
        client.config.Lavalink.id
      );
      if (!CheckNode || !CheckNode.connected) {
        return sendError("Server under maintenance.", interaction);
      }

      const player: any = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      if (
        player.queue &&
        client.channels.cache.get(interaction.channel_id) !==
          client.channels.cache.get(player.textChannel)
      )
        return sendError(
          `The player is already initialized in ${client.channels.cache.get(
            player.textChannel
          )}, use commands over there or use .leave to stop the current player.`,
          interaction
        );

      const search: any = interaction.data.options[0].value;

      if (!search)
        return sendError(
          "You didn't provide what you want me to play",
          interaction
        );

      interaction.send("Searching . . .");

      const SongArray: any = search.split(";; ");

      if (SongArray.length > 5)
        return sendError(
          "You can add a maximum of 5 songs per command.",
          interaction
        );

      async function loadSongs(item) {
        const SearchString: any = item;
        const SongAddedEmbed: any = new MessageEmbed().setColor("343434");

        if (player.state != "CONNECTED") await player.connect();

        try {
          if (SearchString.match(client.Lavasfy.spotifyPattern)) {
            await client.Lavasfy.requestToken();
            const node: any = client.Lavasfy.nodes.get(
              client.config.Lavalink.id
            );
            const Searched: any = await node.load(SearchString);

            if (Searched.loadType === "PLAYLIST_LOADED") {
              const songs: null[] = [];
              for (let i: number = 0; i < Searched.tracks.length; i++)
                songs.push(TrackUtils.build(Searched.tracks[i], member.user));
              player.queue.add(songs);

              if (
                !player.playing &&
                !player.paused &&
                player.queue.totalSize === Searched.tracks.length
              ) {
                channel.send(`Playlist added to queue`);
                return player.play();
              } else {
                SongAddedEmbed.setAuthor(`Playlist added to queue`);
                SongAddedEmbed.addField(
                  "Enqueued",
                  `\`${Searched.tracks.length}\` songs`,
                  false
                );
                //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
                return channel.send(SongAddedEmbed);
              }
            } else if (Searched.loadType.startsWith("TRACK")) {
              player.queue.add(
                TrackUtils.build(Searched.tracks[0], member.user)
              );

              if (!player.playing && !player.paused && !player.queue.size) {
                channel.send(`Song added to queue`);
                return player.play();
              } else {
                SongAddedEmbed.setAuthor(`Song added to queue`);
                SongAddedEmbed.setDescription(
                  `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
                );
                SongAddedEmbed.addField(
                  "Duration",
                  `${prettyMilliseconds(Searched.tracks[0].duration, {
                    colonNotation: true,
                  })} min`,
                  true
                );
                if (player.queue.totalSize > 1)
                  SongAddedEmbed.addField(
                    "Queue position",
                    `${player.queue.size - 0}`,
                    true
                  );
                return channel.send(SongAddedEmbed);
              }
            } else {
              return sendError(
                `No matches found for - ${SearchString} \nNote: Podcasts are not supported`,
                channel
              );
            }
          } else {
            const Searched: any = await player.search(
              SearchString,
              member.user
            );
            if (!player)
              return sendError("Nothing is playing right now...", channel);

            if (Searched.loadType === "NO_MATCHES")
              return sendError(
                `No matches found for - ${SearchString} \nNote: Podcasts are not supported`,
                channel
              );
            else if (Searched.loadType == "PLAYLIST_LOADED") {
              player.queue.add(Searched.tracks);

              if (
                !player.playing &&
                !player.paused &&
                player.queue.totalSize === Searched.tracks.length
              ) {
                channel.send(`Playlist added to queue`);
                return player.play();
              } else {
                SongAddedEmbed.setAuthor(`Playlist added to queue`);
                SongAddedEmbed.addField(
                  "Enqueued",
                  `\`${Searched.tracks.length}\` songs`,
                  false
                );
                //SongAddedEmbed.setFooter(`Playlist duration \`${prettyMilliseconds(Searched.playlist.duration, { colonNotation: true })}\``);
                return channel.send(SongAddedEmbed);
              }
            } else {
              player.queue.add(Searched.tracks[0]);

              if (!player.playing && !player.paused && !player.queue.size) {
                channel.send(`Song added to queue`);
                return player.play();
              } else {
                SongAddedEmbed.setAuthor(`Song added to queue`);
                SongAddedEmbed.setDescription(
                  `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
                );
                SongAddedEmbed.addField(
                  "Duration",
                  `${prettyMilliseconds(Searched.tracks[0].duration, {
                    colonNotation: true,
                  })} min`,
                  true
                );
                if (player.queue.totalSize > 1)
                  SongAddedEmbed.addField(
                    "Queue position",
                    `${player.queue.size - 0}`,
                    true
                  );
                return channel.send(SongAddedEmbed);
              }
            }
          }
        } catch (e) {
          client.log(e);
          return sendError(
            `There was an error while playing ${SearchString}`,
            channel
          );
        }
      }
      SongArray.reverse().forEach(loadSongs);
    },
  },
};
