var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
  name: { type: String, trim: true, required: true },
  motto: { type: String, trim: true },
  aboutSchool: { type: String, trim: true },
  aboutProp: { type: String, trim: true },
  schoolMail: { type: String, trim: true },
  mapDetails: { type: String, trim: true, default: "" },
  uploaderId: { type: String, trim: true, required: true },
  welcome: {
    type: String,
    trim: true,
    default: "Give your wards the best. Register with us now",
  },
  proprietor: { type: String, trim: true, default: "" },
  location: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" },
});

module.exports = mongoose.model("School", schoolSchema);
