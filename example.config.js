module.exports = {
  Developers: ["788684047894839307", "750304140776833065"],

  DefaultPrefix: ".",

  SupportServer: "https://discord.gg/QfZdQynYbg", // change if you have your own

  Token: "", // your bot's auth token
 
  ClientID: "", // your bot's client ID

  ClientSecret: "", // your bot's client secret

  Scopes: ["applications.commands"],

  "24/7": true, // change to false if you don't want 24/7 enabled by default

  prefixesMongoURL:
    "", // connection string for your prefixes database

  songsMongoURL:
    "", // connection string for your songs database

  collectionsMongoURL:
    "", // connection string for your collections database

  preferenceMongoURL:
    "", // connection string for your 24by7 database

  IconURL:
    "https://cdn.discordapp.com/attachments/803882167193042975/812021018365394974/PINKmelody.png", // image url for your bot's icon

  Permissions: 2163734592,

  healthchecks: "", // healthchecks.io token (if you have checks configured, otherwise delete the field

  topgg:
    "", // topgg token of your bot, contact us or browse the code yourself if you want to disable the stats poster

// array of your lavalink nodes, contact us if you don't have exactly 3 nodes
  Lavalink: [
    {
      id: "",
      host: "",
      port: ,
      pass: "",
    },
    {
      id: "",
      host: "",
      port: ,
      pass: "",
    },
    {
      id: "",
      host: "",
      port: ,
      pass: "",
    },
  ],

  Spotify: {
    ClientID: "", //Spotify Client ID
    ClientSecret: "", //Spotify Client Secret
  },
};
