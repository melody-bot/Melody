const mongoose = require("mongoose");

class PreferenceDatabase {
  constructor(client) {
    const guild = new mongoose.Schema({
      name: String,
      id: String,
    });
    this.preferenceSchema = new mongoose.Schema({
      guild: guild,
      twentyfourSeven: Boolean,
      time: Number,
      date: { type: Date, default: Date.now },
    });
    this.preferencedb = mongoose.createConnection(
      client.config.preferenceMongoURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.preferencedb.on(
      "error",
      console.error.bind(console, "connection error:")
    );

    this.model = this.preferencedb.model(`Preferences`, this.preferenceSchema);
  }
}
module.exports = PreferenceDatabase;
