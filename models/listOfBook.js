var mongoose = require("mongoose");
var Schema = mongoose.Schema;

listOfBookSchema = new Schema({
  className: { type: String, trim: true },
  category: { type: String, trim: true, default: null },
  publisher: { type: String, trim: true },
  bookName: { type: String, trim: true },
  subject: { type: String, trim: true },
  createdAt: { type: Number, default: Date.now },
  volume: { type: Number, trim: true, default: null },
  session: { type: String, trim: true },
  edition: { type: Number, trim: true },
  authors: { type: String, trim: true }
});

module.exports = mongoose.model("ListOfBook", listOfBookSchema);
