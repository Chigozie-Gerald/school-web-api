const mongoose = require("mongoose");
const { virtuals } = require(".");
const Schema = mongoose.Schema;

const typesSchema = new Schema(
  {
    fee: [
      {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: "School Fees",
      },
    ],
    currency: [
      {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: "naira",
      },
    ],
    //May give class seperate model
    className: [
      {
        title: { type: String, unique: true, required: true },
        senior: { type: Boolean, required: true },
        createdAt: { type: Number, default: Date.now, required: true },
      },
    ],
    session: [
      {
        title: { type: String, required: true },
        term: { type: Number, default: 3, required: true },
        active: { type: Boolean, default: false, required: true },
        createdAt: { type: Number, default: Date.now, required: true },
      },
    ],
  },
  virtuals
);

typesSchema.pre("validate", function (next) {
  /*
  If a session is added or made active, the other recent fields 
  are turned inactive
  Delicate position
  */
  if (this.session.isModified("session")) {
    const session = this.session.sort((a, b) => b.createdAt - a.createdAt);
    this.session.forEach((element) =>
      session[0] === element._id
        ? (element.active = false)
        : (element.active = true)
    );
    this.session.save((err, saved) => {
      if (err) {
        throw err;
      } else {
        next();
      }
    });
  }
});

module.exports = mongoose.model("Type", typesSchema);

//Types should be one the first things to do before other registration
