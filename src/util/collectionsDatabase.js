const mongoose = require("mongoose");

class CollectionsDatabase {
  constructor(client) {
    const songs = new mongoose.Schema({
      name: String,
      url: String,
    });
    const user = new mongoose.Schema({
      type: Number,
      id: Number,
      name: String,
    });
    this.collectionSchema = new mongoose.Schema({
      name: String,
      songs: [songs],
      user: user,
      date: { type: Date, default: Date.now },
    });
    this.collectionsdb = mongoose
      .createConnection(client.config.collectionsMongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => {
        if (err) client.log(`util/collectionsDatabase.js` + err);
      });

    this.collectionsdb.on(
      "error",
      console.error.bind(console, "connection error:")
    );

    this.model = this.collectionsdb.model(`Collection`, this.collectionSchema);
  }
}
module.exports = CollectionsDatabase;
