const mongoose = require("mongoose");
const { virtuals } = require(".");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const messageSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  seen: { type: Boolean, default: false, required: true },
  createdAt: { type: Number, default: Date.now },
});
const developerSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Number, required: true },
  nextOfKin: { type: String, required: true },
  nextOfKinPhone: { type: Number, required: true },
  nextOfKinEmail: { type: String, required: true },
  nextOfKinAddress: { type: String, required: true },
  schoolname: { type: String, required: true },
  schoolAddress: { type: String, required: true },
  phone: [{ type: Number, required: true }],
  message: [messageSchema],
});

developerSchema.static("sendMessage", function (body, title) {
  this.model
    .findOne()
    .then((dev) => {
      if (dev) {
        dev.message.title = title;
        dev.message.body = body;
        dev.save((err) => {
          if (err) {
            throw err;
          } else {
            return true;
          }
        });
      } else {
        throw "You're to create a dev when creating a school";
      }
    })
    .catch();
});

module.exports = mongoose.model("Developer", developerSchema);
