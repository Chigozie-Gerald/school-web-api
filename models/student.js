const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstname: { type: String, required: true, trim: true, required: true },
  lastname: { type: String, required: true, trim: true, required: true },
  middlename: { type: String, trim: true, default: null },
  address: { type: String, default: "", trim: true, required: true },
  email: { type: String, trim: true },
  dob: { type: String, default: "", trim: true },
  resetToken: { type: String, default: "" },
  sex: { type: String, trim: true, required: true },
  nationality: { type: String, trim: true, required: true },
  stateOfOrigin: { type: String, trim: true, required: true },
  lga: { type: String, trim: true, required: true },
  religion: { type: String, trim: true, default: "" },
  regNumber: { type: String, required: true, unique: true },
  className: { type: String },
  arm: { type: String, trim: true, default: null },
  password: { type: String, required: true },
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
