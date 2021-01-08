var mongoose = require("mongoose");
const {
  staffType,
  classNameType,
  sessionType,
  subjectType,
  armType,
  studentType,
} = require("../controllers/types");
var Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  teacherId: staffType,
  className: classNameType,
  arm: armType,
  session: sessionType,
  subject: subjectType,
  title: { type: String, trim: true, required: true },
  seen: [studentType],
  instruction: { type: String, trim: true },
  questions: [{ type: String, trim: true, required: true }],
  dueDate: { type: Number, required: true },
  dueTime: {
    type: String,
    validate: {
      validator: (value) => {
        return (
          value.length === 4 &&
          parseInt(value.slice(value.length - 2)) < 60 &&
          parseInt(value.slice(0, 2)) < 24 &&
          parseInt(value.slice(0, 2)) > -1
        );
      },
      message: "Invalid Time Type",
    },
  },
  createdAt: { type: Number, default: Date.now },
});

assignmentSchema.pre("validate", function (next) {
  if (this.questions.length === 0) {
    throw "Questions array cannot be empty";
  }
  next();
});

module.exports = mongoose.model("Assignment", assignmentSchema);
