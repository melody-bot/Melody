const { Collection, Client, MessageEmbed } = require("discord.js");
const { LavasfyClient } = require("lavasfy");
const { Manager } = require("erela.js");
const fs = require("fs");
const mongopref = require("discord-mongodb-prefix");
const SongsDatabase = require("./util/songDatabase");
const CollectionsDatabase = require("./util/collectionsDatabase");
const PreferenceDatabase = require("./util/preferenceDatabase");
const path = require("path");
const Logger = require("./util/logger");
const prettyMilliseconds = require("pretty-ms");
const https = require("https");

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
    this.collections = new CollectionsDatabase(this);
    this.preferences = new PreferenceDatabase(this);
    const database = this.database;

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
          id: this.config.Lavalink[0].id,
          host: this.config.Lavalink[0].host,
          port: this.config.Lavalink[0].port,
          password: this.config.Lavalink[0].pass,
        },
        {
          id: this.config.Lavalink[1].id,
          host: this.config.Lavalink[1].host,
          port: this.config.Lavalink[1].port,
          password: this.config.Lavalink[1].pass,
        },
        {
          id: this.config.Lavalink[2].id,
          host: this.config.Lavalink[2].host,
          port: this.config.Lavalink[2].port,
          password: this.config.Lavalink[2].pass,
        },
      ]
    );
    const healthchecks = setInterval(() => {
      if (this.config.healthchecks) {
        https
          .get(`https://hc-ping.com/${this.config.healthchecks}`)
          .on("error", () => {
            this.log("Healthchecks Ping Failed");
          });
      }
    }, 300000);
    const client = this;
    this.Manager = new Manager({
      nodes: [
        {
          identifier: this.config.Lavalink[0].id,
          host: this.config.Lavalink[0].host,
          port: this.config.Lavalink[0].port,
          password: this.config.Lavalink[0].pass,
        },
        {
          identifier: this.config.Lavalink[1].id,
          host: this.config.Lavalink[1].host,
          port: this.config.Lavalink[1].port,
          password: this.config.Lavalink[1].pass,
        },
        {
          identifier: this.config.Lavalink[2].id,
          host: this.config.Lavalink[2].host,
          port: this.config.Lavalink[2].port,
          password: this.config.Lavalink[2].pass,
        },
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        this.log(`Lavalink: Node ${node.options.identifier} connected`)
      )
      .on("nodeError", (node, error) => {
        if (this.config.healthchecks) {
          this.clearInterval(healthchecks);
          https
            .get(`https://hc-ping.com/${client.config.healthchecks}/fail`)
            .on("error", () => {
              this.log("Healthchecks Ping Failed");
            });
        }
        this.log(
          `Lavalink: Node ${node.options.identifier} had an error: ${error.message}`
        );
      })
      .on("trackStart", async (player, track) => {
        const song = player.queue.current;
        const Song = new database.model({
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

        const TrackStartedEmbed = new MessageEmbed()
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
        const channel = await this.channels.fetch(player.textChannel);
        //TODO: .setFooter("Started playing at");
        channel.send(TrackStartedEmbed).catch((e) => this.log(e));
      })
      .on("queueEnd", async (player) => {
        const QueueEmbed = new MessageEmbed()
          .setAuthor("The queue has ended")
          .setColor("343434");
        const channel = await this.channels.fetch(player.textChannel);
        channel.send(QueueEmbed).catch((e) => this.log(e));
        if (!this.config["24/7"]) player.destroy();
      });

    this.ws.on("INTERACTION_CREATE", async (interaction) => {
      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;

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

      const cmd = this.commands.get(command);
      if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(this, interaction, args);
    });
  }

  LoadCommands() {
    const musicDir = path.join(__dirname, ".", "music-cmds");
    const funDir = path.join(__dirname, ".", "fun-cmds");
    const miscDir = path.join(__dirname, ".", "misc-cmds");
    const devDir = path.join(__dirname, ".", "dev-cmds");

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
    const EventsDir = path.join(__dirname, ".", "events");
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
    const prefix = await mongopref.fetch(guild);
    return prefix;
  }

  async setPrefix(guild, prefix) {
    await mongopref.changeprefix(guild, prefix);
    return;
  }

  sendError(Channel, Error) {
    const embed = new MessageEmbed()
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
