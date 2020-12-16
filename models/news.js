const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const newsModel = new Schema({
  title: { type: String, required: true },
  // uploaderId: { type: ObjectId, required: true },
  uploaderId: { type: String, required: true },
  body: [
    {
      quote: { type: Boolean, default: false },
      quoteOwner: { type: String, default: "Anonymous" },
      text: { type: String, required: true },
    },
  ],
  summary: { type: String, required: true },
  title: { type: String, required: true },
  comments: [
    {
      _id: false,
      phone: { type: Number },
      email: { type: String },
      body: { type: String, required: true },
    },
  ],
  createdAt: { type: String, default: Date.now },
});

// NewsReport because pluralizing 'News' would be weird
//as required by mongoose documents
module.exports = mongoose.model("NewsReport", newsModel);
