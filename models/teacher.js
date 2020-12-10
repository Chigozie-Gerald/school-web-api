var mongoose = require("mongoose");
objectId = mongoose.Schema.Types.ObjectId;

Schema = moongoose.Schema;

teacherSchema = new Schema({
  firstname: { type: String, required: true, trim: true },
  formteacher: {
    _id: false,
    isFormTeacher: { type: Boolean, default: false },
    className: {
      _id: false,
      name: { type: String },
    },
  },
  lastname: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  address: { type: String, default: "", trim: true },
  resetToken: { type: String, default: "" },
  dateEmployed: { type: String, default: Date.now() },
  email: { type: String, required: true, trim: true },
  title: { type: String, default: "", trim: true },
  dob: { type: String, default: "", trim: true },
  sex: { type: String, required: true, trim: true },
  nationality: { type: String, required: true, trim: true },
  stateOfOrigin: { type: String, required: true, trim: true },
  lga: { type: String, required: true, trim: true },
  religion: { type: String, trim: true, default: "" },
  maritalStatus: { type: String, trim: true, default: "single" },
  password: { type: String, require: true },
  qualification: [
    {
      _id: false,
      certication: { type: String, default: "" },
      year: { type: String, default: "" },
      institution: { type: String, default: "" },
    },
  ],
  phoneNumber: [
    {
      _id: false,
      type: Number,
      default: "",
      trim: true,
    },
  ],
  subject: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      className: {
        type: String,
        trim: true,
        required: true,
      },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
