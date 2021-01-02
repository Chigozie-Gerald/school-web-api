const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const STAFFMODEL = new Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  role: [
    {
      _id: false,
      type: String,
      required: true,
      trim: true,
    },
  ],
  sex: { type: String, required: true },
  staffId: { type: String, required: true },
  lga: { type: String, trim: true },
  teacher: { type: Boolean, required: true, trim: true, default: true },
  editor: { type: Boolean, required: true, trim: true, default: false },
  admin: { type: Boolean, required: true, trim: true, default: false },
  address: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  qualifications: [
    {
      _id: false,
      certication: { type: String, default: "" },
      year: { type: String, default: "" },
      institution: { type: String, default: "" },
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
  email: [
    {
      _id: true,
      type: String,
      required: true,
      trim: true,
    },
  ],
  formteacher: [
    {
      _id: false,
      className: { type: String },
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
  maritalStatus: { type: String, trim: true, default: "single" },
  title: { type: String, required: true, trim: true },
  nationality: { type: String, default: "nigeria" },
  dob: { type: String, required: true, trim: true },
  stateOfOrigin: { type: String, required: true, trim: true },
  religion: { type: String, trim: true, default: "" },
  resetToken: { type: String, default: "" },
  dateEmployed: { type: String, default: Date.now },
  students: [{ type: objectId, ref: "Student" }],
  password: { type: String, required: true },
});

STAFFMODEL.post("validate", function () {
  //Make document having editor to be true to be an admin automatically
});
module.exports = mongoose.model("Staff", STAFFMODEL);

//Added Admin key-value pair
//Editors can do all, admin can do some
