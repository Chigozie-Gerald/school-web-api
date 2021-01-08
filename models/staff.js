const mongoose = require("mongoose");
const { default: validator } = require("validator");
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;
const title = ["mr", "mrs", "master", "ms", "dr", "prof", "eng"];
const maritalStatus = ["single", "married", "divorce", "engaged"];
let date = new Date();
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
  editor: { type: Boolean, required: true, trim: true, default: false },
  sex: { type: String, enum: ["m", "f"], required: true },
  lga: { type: String, trim: true },
  staffId: { type: String, unique: true, required: true },
  teacher: { type: Boolean, required: true, trim: true, default: true },
  admin: { type: Boolean, required: true, trim: true, default: false },
  address: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: "" },
  qualifications: [
    {
      _id: false,
      certication: { type: String, default: "", required: true },
      year: {
        type: Number,
        default: "",
        required: true,
        min: date.getFullYear() - 70,
        max: date.getFullYear(),
      },
      institution: { type: String, default: "", required: true },
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

  nokFirstname: { type: String, trim: true, required: true },
  nokLastname: { type: String, trim: true, required: true },
  nokAddress: { type: String, trim: true, required: true },
  nokEmail: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid Email Provided",
    },
  },
  nokPhoneNumber: { type: Number, trim: true, required: true },
  image: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Bad url provided",
    },
  },
  email: {
    _id: true,
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid Email Provided",
    },
  },
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
  maritalStatus: {
    type: String,
    enum: maritalStatus,
    trim: true,
    default: "single",
  },
  title: { type: String, enum: title, required: true, trim: true },
  nationality: { type: String, default: "nigeria" },
  dob: { type: Date, required: true, trim: true },
  stateOfOrigin: { type: String, required: true, trim: true },
  religion: {
    type: String,
    enum: ["ch", "ms", "trad", "none", "others"],
    trim: true,
    default: "none",
  },
  resetToken: { type: String, default: "" },
  dateEmployed: { type: String, default: Date.now },
  students: [{ type: objectId, ref: "Student" }],
  password: { type: String, required: true },
});

STAFFMODEL.pre("validate", function (next) {
  if (this.qualifications.length === 0) {
    throw "Qualifications not provided";
  } else {
    if (this.isModified("editor") || this.editor) {
      if (this.editor) {
        this.admin = true;
      }
    }
    next();
  }
  //Make document having editor to be true to be an admin automatically
});
module.exports = mongoose.model("Staff", STAFFMODEL);

//Added Admin key-value pair
//Editors can do all, admin can do some
