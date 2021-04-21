require("dotenv").config();//Loading .env
const fs = require("fs");
const { Collection, Client} = require("discord.js");
const { RedisClient } = require("@puyodead1/discord.js-redis")
const client = new Client();//Making a discord bot client
const redis = new RedisClient(client, {
  host: 'redis-14538.c251.east-us-mz.azure.cloud.redislabs.com',
  port: '14538',
  password: 'KcATrhsN3qExQW8q2WcZYgrlWluqismr'
});

redis.on('ready', () => console.log('Redis ready!'));
client.commands = new Collection();//Making client.commands as a Discord.js Collection
client.queue = new Map()

client.config = {
  prefix: process.env.PREFIX
}

//Loading Events
fs.readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log("Loading Event: "+eventName)
  });
});

//Loading Music Commands
fs.readdir("./music cmds/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./music cmds/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log("Loading Music Command: "+commandName)
  });
});


//Logging in to discord
client.login(process.env.TOKEN)
