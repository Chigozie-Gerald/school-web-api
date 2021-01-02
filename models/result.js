const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//Each document indicates a student
//`unique: true` needs useCreateIndex in connect to be set to true
const resultSchema = new Schema({
  studentId: { type: ObjectId, ref: "Student", required: true, unique: true },
  result: [{ type: Array, required: true }],
  createdAt: { type: String, default: Date.now },
});

resultSchema.pre("findOneAndUpdate", function (next) {
  console.log("saving");
  next();
});

module.exports = mongoose.model("Result", resultSchema);
