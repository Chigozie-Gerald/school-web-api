const mongoose = require("mongoose");
const { studentType } = require("../controllers/types");
const Schema = mongoose.Schema;

//Each document indicates a student
//`unique: true` needs useCreateIndex in connect to be set to true
const resultSchema = new Schema({
  studentId: studentType,
  result: [{ type: Array, required: true }],
  createdAt: { type: String, default: Date.now },
});

resultSchema.pre("findOneAndUpdate", function (next) {
  console.log("saving");
  next();
});

module.exports = mongoose.model("Result", resultSchema);
