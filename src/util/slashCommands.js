const fs = require("fs");
const path = require("path");

/**
 * Register slash commands for a guild
 * @param {require("../melodyClient")} client
 * @param {string} guild
 */
module.exports = (client, guild) => {
  client.log(`Registering slash commands for ${guild}`);

  const MusicDir = path.join(__dirname, "..", "music-cmds");
  const FunDir = path.join(__dirname, "..", "fun-cmds");
  const MiscDir = path.join(__dirname, "..", "misc-cmds");

  fs.readdir(MusicDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (file) => {
      const cmd = require(MusicDir + "/" + file); // skipcq
      if (!cmd.SlashCommand || !cmd.SlashCommand.run) return;
      const dataStuff = {
        name: cmd.name,
        description: cmd.description,
        options: cmd.SlashCommand.options,
      };

      const ClientAPI = client.api.applications(client.user.id);
      const GuildAPI = ClientAPI.guilds(guild);
      // skipcq
      client.log(
        "[Slash Command]: [POST] Guild " +
          guild +
          ", Music Command: " +
          dataStuff.name
      );
      try {
        await GuildAPI.commands.post({ data: dataStuff });
      } catch (e) {
        // skipcq
        client.log(
          "[Slash Command]: [POST-FAILED] Guild " +
            guild +
            ", Music Command: " +
            dataStuff.name
        );
        client.log(e);
      }
    });
  });
  fs.readdir(FunDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (file) => {
      const cmd = require(FunDir + "/" + file); // skipcq
      if (!cmd.SlashCommand || !cmd.SlashCommand.run) return;
      const dataStuff = {
        name: cmd.name,
        description: cmd.description,
        options: cmd.SlashCommand.options,
      };

      const ClientAPI = client.api.applications(client.user.id);
      const GuildAPI = ClientAPI.guilds(guild);
      // skipcq
      client.log(
        "[Slash Command]: [POST] Guild " +
          guild +
          ", Fun Command: " +
          dataStuff.name
      );
      try {
        await GuildAPI.commands.post({ data: dataStuff });
      } catch (e) {
        // skipcq
        client.log(
          "[Slash Command]: [POST-FAILED] Guild " +
            guild +
            ", Fun Command: " +
            dataStuff.name
        );
        client.log(e);
      }
    });
  });
  fs.readdir(MiscDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (file) => {
      const cmd = require(MiscDir + "/" + file); // skipcq
      if (!cmd.SlashCommand || !cmd.SlashCommand.run) return;
      const dataStuff = {
        name: cmd.name,
        description: cmd.description,
        options: cmd.SlashCommand.options,
      };

      const ClientAPI = client.api.applications(client.user.id);
      const GuildAPI = ClientAPI.guilds(guild);
      // skipcq
      client.log(
        "[Slash Command]: [POST] Guild " +
          guild +
          ", Misc Command: " +
          dataStuff.name
      );
      try {
        await GuildAPI.commands.post({ data: dataStuff });
      } catch (e) {
        // skipcq
        client.log(
          "[Slash Command]: [POST-FAILED] Guild " +
            guild +
            ", Misc Command: " +
            dataStuff.name
        );
        client.log(e);
      }
    });
  });
};
