const mongoose = require("mongoose");
objectId = mongoose.Schema.Types.objectId;
Schema = mongoose.Schema;

propSchema = new Schema({
  firstname: { type: String, requried: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  qualifications: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  nationality: { type: String, default: "nigeria" },
  dob: { type: String, required: true, trim: true },
  stateOfOrigin: { type: String, required: true, trim: true },
  maritalStatus: { type: String, default: "" },
  religion: { type: String, trim: true, default: "" },
  password: { type: true, required: true },
  students: [{ type: objectId, ref: Student }],
  nonTeachingStaff: [{ type: objectId, ref: Nonteacher }],
  teachers: [{ type: objectId, ref: Teacher }],
  headteacher: [{ type: objectId, ref: HeadTeacher }]
});

module.exports = mongoose.model("Prop", propSchema);
