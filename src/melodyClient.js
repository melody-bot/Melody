const { Collection, Client, MessageEmbed } = require("discord.js");
const { LavasfyClient } = require("lavasfy");
const { Manager } = require("erela.js");
const fs: any = require("fs");
const mongopref: any = require("discord-mongodb-prefix");
const SongsDatabase: any = require("./util/songDatabase");
const path: any = require("path");
const Logger: any = require("./util/logger");
const prettyMilliseconds: any = require("pretty-ms");

class Melody extends Client {
  constructor(props) {
    super(props);

    this.commands = new Collection();
    this.connections = new Map();
    this.prefix = new Map();
    this.Ready = false;
    this.logger = new Logger(path.join(__dirname, ".", "client.log"));
    this.config = require("../config");

    if (this.config.Token === "")
      return new TypeError("No bot token specified in config.js");

    this.LoadCommands();
    this.LoadEvents();

    mongopref.setURL(`${this.config.prefixesMongoURL}`);

    mongopref.setDefaultPrefix(this.config.DefaultPrefix);

    this.database = new SongsDatabase(this);
    const database: any = this.database;

    //Utils
    this.ProgressBar = require("./util/progressbar");
    this.Pagination = require("./util/pagination");
    this.ParseHumanTime = (str) => {
      let Parsed;
      try {
        Parsed = require("./util/timeString")(str);
        return Parsed;
      } catch {
        Parsed = false;
        return Parsed;
      }
    };

    this.Lavasfy = new LavasfyClient(
      {
        clientID: this.config.Spotify.ClientID,
        clientSecret: this.config.Spotify.ClientSecret,
      },
      [
        {
          id: this.config.Lavalink.id,
          host: this.config.Lavalink.host,
          port: this.config.Lavalink.port,
          password: this.config.Lavalink.pass,
        },
      ]
    );

    const client: any = this;
    this.Manager = new Manager({
      nodes: [
        {
          identifier: this.config.Lavalink.id,
          host: this.config.Lavalink.host,
          port: this.config.Lavalink.port,
          password: this.config.Lavalink.pass,
        },
      ],
      send(id, payload) {
        const guild: any = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        this.log(`Lavalink: Node ${node.options.identifier} connected`)
      )
      .on("nodeError", (node, error) =>
        this.log(
          `Lavalink: Node ${node.options.identifier} had an error: ${error.message}`
        )
      )
      .on("trackStart", (player, track) => {
        const song: any = player.queue.current;
        const Song: any = new database.model({
          name: track.title,
          url: track.uri,
          duration: track.duration,
          songAuthor: song.author,
          userid: song.requester.id,
          usertag: song.requester.tag,
          guild: player.guild,
        });
        Song.save((err) => {
          if (err) return client.log(err);
        });

        const TrackStartedEmbed: any = new MessageEmbed()
          .setAuthor(`Started playing ♪`, this.config.IconURL)
          .setDescription(`[${track.title}](${track.uri})`)
          .setFooter(`Requested by - ${song.requester.tag}`)
          .addField(
            "Duration",
            `${prettyMilliseconds(track.duration, {
              colonNotation: true,
            })} min`,
            true
          )
          .addField("Author", `${song.author}`, true)
          .setColor("343434");
        //TODO: .setFooter("Started playing at");
        this.channels.cache.get(player.textChannel).send(TrackStartedEmbed);
      })
      .on("queueEnd", (player) => {
        const QueueEmbed: any = new MessageEmbed()
          .setAuthor("The queue has ended")
          .setColor("343434");
        this.channels.cache.get(player.textChannel).send(QueueEmbed);
        if (!this.config["24/7"]) player.destroy();
      });

    this.ws.on("INTERACTION_CREATE", async (interaction) => {
      const command: any = interaction.data.name.toLowerCase();
      const args: any = interaction.data.options;

      interaction.guild = await this.guilds.fetch(interaction.guild_id); // skipcq
      interaction.send = async (message) => {
        await this.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data:
                typeof message === "string"
                  ? { content: message }
                  : message.type && message.type === "rich"
                  ? { embeds: [message] }
                  : message,
            },
          });
        return;
      };

      const cmd: any = this.commands.get(command);
      if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(this, interaction, args);
    });
  }

  LoadCommands() {
    const musicDir: any = path.join(__dirname, ".", "music-cmds");
    const funDir: any = path.join(__dirname, ".", "fun-cmds");
    const miscDir: any = path.join(__dirname, ".", "misc-cmds");
    const devDir: any = path.join(__dirname, ".", "dev-cmds");

    fs.readdir(musicDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const cmd = require(musicDir + "/" + file); // skipcq
          if (!cmd.name || !cmd.description || !cmd.run)
            // skipcq
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't have run/name/description property"
            );
          this.commands.set(file.split(".")[0], cmd);
          this.log("Music Command Loaded: " + file.split(".")[0]); // skipcq
        });
    });
    fs.readdir(funDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const cmd = require(funDir + "/" + file); // skipcq
          if (!cmd.name || !cmd.description || !cmd.run)
            // skipcq
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't have run/name/description property"
            );
          this.commands.set(file.split(".")[0], cmd);
          this.log("Fun Command Loaded: " + file.split(".")[0]); // skipcq
        });
    });
    fs.readdir(miscDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const cmd = require(miscDir + "/" + file); // skipcq
          if (!cmd.name || !cmd.description || !cmd.run)
            // skipcq
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't have run/name/description property"
            );
          this.commands.set(file.split(".")[0], cmd);
          this.log("Misc Command Loaded: " + file.split(".")[0]); // skipcq
        });
    });
    fs.readdir(devDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const cmd = require(devDir + "/" + file); // skipcq
          if (!cmd.name || !cmd.description || !cmd.run)
            // skipcq
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't have run/name/description property"
            );
          this.commands.set(file.split(".")[0], cmd);
          this.log("Music Command Loaded: " + file.split(".")[0]); // skipcq
        });
    });
  }

  LoadEvents() {
    const EventsDir: any = path.join(__dirname, ".", "events");
    fs.readdir(EventsDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file); // skipcq
          this.on(file.split(".")[0], event.bind(null, this));
          this.logger.log("Event Loaded: " + file.split(".")[0]); // skipcq
        });
    });
  }

  log(logs) {
    this.logger.log(logs);
  }

  async getPrefix(guild) {
    const prefix: any = await mongopref.fetch(guild);
    return prefix;
  }

  async setPrefix(guild, prefix) {
    await mongopref.changeprefix(guild, prefix);
    return;
  }

  sendError(Channel, Error) {
    const embed: any = new MessageEmbed()
      .setTitle("An error occured")
      .setColor("RED")
      .setDescription(Error)
      .setFooter(
        "If you think this as a bug, please report it in the support server!"
      );

    Channel.send(embed);
  }

  start() {
    this.login(this.config.Token);
  }

  async RegisterSlashCommands() {
    this.guilds.cache.forEach((guild) => {
      require("./util/slashCommands")(this, guild.id);
    });
  }
}

module.exports = Melody;
