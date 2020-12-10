mongoose = require("mongoose");

const Schema = mongoose.Schema;
var date = new Date();
const studentSchema = new Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: null },
  address: { type: String, default: "", trim: true },
  email: { type: String, trim: true },
  dob: { type: String, default: "", trim: true },
  resetToken: { type: String, default: "" },
  sex: { type: String, trim: true },
  nationality: { type: String, trim: true },
  stateOfOrigin: { type: String, trim: true },
  lga: { type: String, trim: true },
  religion: { type: String, trim: true, default: "" },
  regNumber: { type: String },
  className: { type: String },
  arm: { type: String, trim: true, default: null },
  password: { type: String, required: true },
  createdAt: { type: String, default: date.toUTCString() },
  classResult: [
    {
      _id: false,
      name: { type: String, trim: true },
      session: [
        {
          _id: false,
          name: { type: String },
          term: [
            {
              _id: false,
              name: { type: String, trim: true },
              subject: [
                {
                  _id: false,
                  name: { type: String, trim: true },
                  test1: { type: Number, trim: true },
                  test2: { type: Number, trim: true },
                  examination: { type: Number, trim: true },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
