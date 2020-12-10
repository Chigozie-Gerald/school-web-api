var mongoose = require("mongoose");
Schema = mongoose.Schema;

nonTeacherSchema = new Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  address: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  dateEmployed: { type: String, default: Date.now() },
  dob: { type: String, required: true },
  resetToken: { type: String, default: "" },
  sex: { type: String, required: true },
  nationality: { type: String, default: "nigeria" },
  stateOfOrigin: { type: String, required: true, trim: true },
  religion: { type: String, trim: true, default: "" },
  lga: { type: String, required: true, trim: true },
  maritalStatus: { type: String, default: "" },
  password: { type: true, required: true },
  qualification: [
    {
      _id: false,
      certication: { type: String, default: "" },
      year: { type: String, default: "" },
      institution: { type: String, default: "" },
    },
  ],
  positionHeld: [
    {
      _id: false,
      type: String,
      required: true,
      trim: true,
    },
  ],
  phoneNumber: [
    {
      _id: true,
      type: Number,
      required: true,
      trim: true,
    },
  ],
});

module.exports = mongoose.model("Nonteacher", nonTeacherSchema);
