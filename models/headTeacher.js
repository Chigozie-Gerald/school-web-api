var mongoose = require("mongose");
const objectId = mongoose.Schema.Types.objectId;

const Schema = mongoose.Schema;

const headTeacherSchema = new Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  qualifications: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  nationality: { type: String, default: "nigeria" },
  dob: { type: String, required: true, trim: true },
  stateOfOrigin: { type: String, required: true, trim: true },
  religion: { type: String, trim: true, default: "" },
  resetToken: { type: String, default: "" },
  dateEmployed: { type: String, default: Date.now },
  maritalStatus: { type: String, default: "" },
  teachers: [{ type: objectId, ref: "Teacher" }],
  nonTeachingStaff: [{ type: objectId, ref: "nonTeachers" }],
  students: [{ type: objectId, ref: "Student" }],
  password: { type: true, required: true },
});

module.exports = mongoose.model("HeadTeacher", headTeacherSchema);
