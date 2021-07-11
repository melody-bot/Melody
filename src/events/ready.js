// skipcq
module.exports = async (client) => {
  client.Ready = true;

  const statusList = [
    {
      msg: ".help",
      type: "LISTENING",
    },
    {
      msg: "outside (JK who does that?)",
      type: "PLAYING",
    },
    {
      msg: "alone :(",
      type: "PLAYING",
    },
    {
      msg: "with your heart </3",
      type: "PLAYING",
    },
    {
      msg: "who even reads these anyways?",
      type: "PLAYING",
    },
    {
      msg: "music",
      type: "PLAYING",
    },
    {
      msg: "the haters hate",
      type: "WATCHING",
    },
    {
      msg: "you (turn around)",
      type: "WATCHING",
    },
    {
      msg: "grass grow",
      type: "WATCHING",
    },

    {
      msg: "the world crumble",
      type: "WATCHING",
    },
  ];

  client.Manager.init(client.user.id);

  setInterval(async () => {
    const index = Math.floor(Math.random() * statusList.length + 1) - 1;
    await client.user.setActivity(statusList[index].msg, {
      type: statusList[index].type,
    });
  }, 60000);

  client.user.setStatus("idle");

  client.log(`[API] Logged in as ${client.user.username}
    Bot is running with ${client.guilds.cache.size} servers have ${client.users.cache.size} members and ${client.channels.cache.size} `);
};
