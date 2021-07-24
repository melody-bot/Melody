const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const _ : any = require("lodash");
const prettyMilliseconds : any = require("pretty-ms");
const sendError : any = require("../util/error");

module.exports = {
  name: "search",
  description: "Search a song/playlist",
  usage: "search <song>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["se"],
  example: ["se lenka", "search faded"],
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
        "You need to be in a voice channel to use this command!",
        message.channel
      );

    if (
      message.guild.me.voice.channel &&
      message.guild.me.voice.channel != message.member.voice.channel
    )
      return sendError(
        `I am sorry but you need to be in the same voice channel to use this command!`,
        message.channel
      );

    const SearchString : any = args.join(" ");
    if (!SearchString)
      return sendError(`Tell me what to search!`, message.channel);
    const CheckNode : any = client.Manager.nodes.get(client.config.Lavalink.id);
    if (!CheckNode || !CheckNode.connected) {
      return sendError("Server under maintenance.", message.channel);
    }
    const player : any = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

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

    const Searched : any = await player.search(SearchString, message.author);
    if (Searched.loadType == "NO_MATCHES")
      return sendError(`No matches found for ${SearchString}`, message.channel);
    else {
      Searched.tracks = Searched.tracks.map((s, i) => {
        s.index = i;
        return s;
      });
      const songs : any = _.chunk(Searched.tracks, 10);
      const Pages : any = songs.map((songz) => {
        const MappedSongs : any = songz.map(
          (s) =>
            `${s.index + 1}. [${s.title}](${
              s.uri
            }) \nDuration: ${prettyMilliseconds(s.duration, {
              colonNotation: true,
            })} min`
        );

        const em : any = new MessageEmbed()
          .setAuthor(`Search Results of ${SearchString}`, client.config.IconURL)
          .setColor("343434")
          .setDescription(MappedSongs.join("\n\n"));
        return em;
      });

      if (!Pages.length || Pages.length === 1)
        return message.channel.send(Pages[0]);
      else client.Pagination(message, Pages);

      const w : any = (a) => new Promise((r) => setInterval(r, a));
      await w(500);
      const msg : any = await message.channel.send(
        "Type the serial number of the song you want to play! **Expires in 30 seconds**"
      );

      let er : boolean = false;
      const SongID : any = await message.channel
        // skipcq
        .awaitMessages((msg) => message.author.id === msg.author.id, {
          max: 1,
          errors: ["time"],
          time: 30000,
        })
        .catch(() => {
          er = true;
          msg.edit(
            "You took too long to respond! Run the command again to play"
          );
        });
      if (er) return;
      /**@type {Message} */

      const SongIDmsg : any = SongID.first();

      // skipcq
      if (!parseInt(SongIDmsg.content))
        return sendError("Please send correct song number", message.channel);

      let Song = Searched.tracks[parseInt(SongIDmsg.content) - 1]; // skipcq

      if (!Song)
        return message.channel.send("No song found for the given number");

      player.queue.add(Song);

      if (!player.playing && !player.paused && !player.queue.size) {
        message.channel.send(`Song added to queue`);
        return player.play();
      } else {
        const SongAddedEmbed : any = new MessageEmbed()
          .setAuthor(`Song added to queue`)
          .setDescription(`[${Song.title}](${Song.uri})`)
          .addField(
            "Duration",
            `${prettyMilliseconds(Song.duration, { colonNotation: true })} min`,
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
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        required: true,
        description: "Search a song/playlist",
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
      const guild : any = client.guilds.cache.get(interaction.guild_id);
      const member : any = guild.members.cache.get(interaction.member.user.id);
      const awaitchannel : any = client.channels.cache.get(interaction.channel_id);
      try {
        if (!member.voice.channel)
          return sendError(
            "You need to be in a voice channel to use this command!",
            interaction
          );
      } catch (e) {
        return sendError(
          "You need to be in a voice channel to use this command!",
          interaction
        );
      }
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return sendError(
          `I am sorry but you need to be in the same voice channel to use this command!`,
          interaction
        );

      const CheckNode : any = client.Manager.nodes.get(client.config.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return sendError("Server under maintenance.", interaction);
      }
      const player : any = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      if (player.state != "CONNECTED") await player.connect();

      const search : any = interaction.data.options[0].value;
      let res;

      if (search.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        const node : any = client.Lavasfy.nodes.get(client.config.Lavalink.id);
        const Searched : any = await node.load(search);

        switch (Searched.loadType) {
          case "LOAD_FAILED": {
            if (!player.queue.current) player.destroy();
            return sendError(`There was an error while searching`, interaction);
          }

          case "NO_MATCHES": {
            if (!player.queue.current) player.destroy();
            return sendError("No results were found", interaction);
          }

          case "TRACK_LOADED": {
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            return interaction.send(
              `Added to queue: \`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri}}\`.`
            );
          }

          case "PLAYLIST_LOADED": {
            const songs : null[] = [];
            for (let i : number = 0; i < Searched.tracks.length; i++)
              songs.push(TrackUtils.build(Searched.tracks[i], member.user));
            player.queue.add(songs);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === Searched.tracks.length
            )
              player.play();
            return interaction.send(
              `Playlist added to queue: \n**${Searched.playlist.name}** \nEnqueued: **${Searched.playlistInfo.length} songs**`
            );
          }
        }
      } else {
        try {
          res = await player.search(search, member.user);
          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            throw new Error(res.exception.message);
          }
        } catch (err) {
          return sendError(
            `There was an error while searching: ${err.message}`,
            interaction
          );
        }
        switch (res.loadType) {
          case "NO_MATCHES": {
            if (!player.queue.current) player.destroy();
            return sendError("No results were found", interaction);
          }
          case "TRACK_LOADED": {
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            return interaction.send(
              `Added to queue: \`[${res.tracks[0].title}](${res.tracks[0].uri})\`.`
            );
          }

          case "PLAYLIST_LOADED": {
            player.queue.add(res.tracks);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.size === res.tracks.length
            )
              player.play();
            return interaction.send(
              `Playlist added to queue: \n${res.playlist.name} \nEnqueued: ${res.playlistInfo.length} songs`
            );
          }

          case "SEARCH_RESULT": {
            let max : number = 10,
              collected,
              filter : any = (m) =>
                m.author.id === interaction.member.user.id &&
                /^(\d+|end)$/i.test(m.content);
            if (res.tracks.length < max) max = res.tracks.length;

            const results : any = res.tracks
              .slice(0, max)
              .map(
                (track, index) =>
                  `${++index} - [${track.title}](${
                    track.uri
                  }) \n\t Duration: ${prettyMilliseconds(track.duration, {
                    colonNotation: true,
                  })} min\n`
              )
              .join("\n");

            const resultss : any = new MessageEmbed()
              .setDescription(
                `${results}\n\t**Type the number of the song you want to play! Type cancel to cancel the search**\n`
              )
              .setColor("343434")
              .setAuthor(
                `Search results for \`${search}\``,
                client.config.IconURL
              );
            interaction.send(resultss);
            try {
              collected = await awaitchannel.awaitMessages(filter, {
                max: 1,
                time: 30e3,
                errors: ["time"],
              });
            } catch (e) {
              if (!player.queue.current) player.destroy();
              return awaitchannel.send("You didn't provide a selection!");
            }

            const first : any = collected.first().content;

            if (first.toLowerCase() === "cancel") {
              if (!player.queue.current) player.destroy();
              return awaitchannel.send("Cancelled search!");
            }

            const index : any = Number(first) - 1;
            if (index < 0 || index > max - 1)
              return awaitchannel.send(
                `The number you provided was greater or less than the search total. Usage - \`(1-${max})\``
              );
            const track : any = res.tracks[index];
            player.queue.add(track);

            if (!player.playing && !player.paused && !player.queue.length) {
              awaitchannel.send(`Song added to queue`);
              return player.play();
            } else {
              const SongAddedEmbed : any = new MessageEmbed()
                .setAuthor(`Song added to queue`)
                .setDescription(`[${track.title}](${track.uri})`)
                .addField(
                  "Duration",
                  `${prettyMilliseconds(track.duration, {
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
              return awaitchannel.send(SongAddedEmbed);
            }
          }
        }
      }
    },
  },
};
