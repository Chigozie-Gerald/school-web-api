const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const resultSchema = new Schema({
  _id: false,
  studentId: { type: ObjectId, required: true },
  result: [{ type: Array, required: true }],
  createAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
