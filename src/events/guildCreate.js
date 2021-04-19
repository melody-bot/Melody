// skipcq
module.exports = async (client, guild) => {
  require("../util/slashCommands")(client, guild.id);
};
