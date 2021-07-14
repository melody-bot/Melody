const mongoose = require("mongoose");

class CollectionsDatabase {
  constructor(client) {
    this.collectionSchema = new mongoose.Schema({
      name: String,
      songs: [
        { name: String, url: String, duration: Number, songAuthor: String },
      ],
      user: { type: Number, id: Number, name: String },
      date: { type: Date, default: Date.now },
    });
    this.collectionsdb = mongoose.createConnection(
      client.config.collectionsMongoURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.collectionsdb.on(
      "error",
      console.error.bind(console, "connection error:")
    );

    this.model = this.collectionsdb.model(`Collection`, this.collectionSchema);
  }
}
module.exports = CollectionsDatabase;
