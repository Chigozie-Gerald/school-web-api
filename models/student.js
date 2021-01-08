const mongoose = require("mongoose");
const { default: validator } = require("validator");

const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "Firstname is required"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required"],
    trim: true,
  },
  middlename: { type: String, trim: true, default: null },
  image: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Bad url provided",
    },
  },
  address: {
    type: String,
    default: "",
    trim: true,
    required: [true, "Address is required"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  resetToken: { type: String, default: "" },
  sex: {
    type: String,
    trim: true,
    enum: ["m", "f"],
    required: [true, "Gender is required"],
  },
  nationality: {
    type: String,
    trim: true,
    required: [true, "Nationality is required"],
  },

  guardianFirstname: {
    type: String,
    trim: true,
    required: [true, "Guardian's Firstname is required"],
  },
  guardianLastname: {
    type: String,
    trim: true,
    required: [true, "Guardian's Lastname is required"],
  },
  guardianAddress: {
    type: String,
    trim: true,
    required: [true, "Guardian's Address is required"],
  },
  guardianEmail: {
    type: String,
    trim: true,
    required: [true, "Guardian's Email is required"],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid Email Provided",
    },
  },
  guardianPhoneNumber: {
    type: Number,
    trim: true,
    required: [true, "Guardian's Phone Number is required"],
  },

  stateOfOrigin: {
    type: String,
    trim: true,
    required: [true, "State of origin is required"],
  },
  lga: { type: String, trim: true, required: [true, "LGA is required"] },
  religion: { type: String, trim: true, default: "" },
  regNumber: {
    type: String,
    required: [true, "Class is required"],
    unique: true,
  },
  className: { type: String },
  arm: { type: String, trim: true, default: null },
  password: { type: String, required: [true, "Password is required"] },
  createdAt: { type: String, default: Date.now },
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

// studentSchema.pre("updateOne", async function (next) {
//   const data = this.getUpdate();
//   const queryKeys = Object.keys(data);
//   let queryArr = [];
//   const checkQuery = (arr, innerData = data) => {
//     arr.map((elem) => {
//       if (elem === "$set" || elem === "$push") {
//         checkQuery(Object.keys(innerData[elem]), innerData[elem]);
//       } else {
//         queryArr.push(elem);
//       }
//     });
//   };
//   checkQuery(queryKeys);
//   const isModified = (value) => queryArr.includes(value);
//   if (isModified("stateOfOrigin")) {
//     data.stateOfOrigin = "added";
//     console.log(data.stateOfOrigin);
//   }
//   if (isModified("nationality")) {
//     data.nationslity += "added";
//     console.log(data.nationality);
//   }
//   next();
// });
module.exports = mongoose.model("Student", studentSchema);

//Migrate from update to regular save modes
