var mongoose = require("mongoose");
var Schema = mongoose.Schema;

assignmentSchema = new Schema({
  className: { type: String, trim: true },
  arm: { type: String, trim: true },
  subject: { type: String, trim: true },
  text: { type: String, trim: true },
  createdAt: { type: Number, default: Date.now },
  submit: { type: Number, trim: true },
  time: { type: String, trim: true },
  teacherId: { type: String, trim: true }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
