const mongoose = require("mongoose");

class SongsDatabase {
  constructor(client) {
    this.songSchema = new mongoose.Schema({
      name: String,
      url: String,
      duration: Number,
      songAuthor: String,
      userid: Number,
      usertag: String,
      guild: Number,
      date: { type: Date, default: Date.now },
    });
    this.songsdb = mongoose
      .createConnection(client.config.songsMongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => {
        if (err) client.log(`util/songDatabase.js` + err);
      });

    this.songsdb.on("error", console.error.bind(console, "connection error:"));

    this.model = this.songsdb.model(`Song`, this.songSchema);
    this.songsPlayed = this.model.countDocuments({});
  }
}
module.exports = SongsDatabase;
