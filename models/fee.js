const mongoose = require("mongoose");
const Type = require("./Types");
const { virtuals } = require(".");
const Types = require("./Types");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

feeSchema = new Schema(
  {
    name: { type: String, trim: true },
    class: [{ type: ObjectId, trim: true }],
    adminId: { type: ObjectId, required: true },
    allClasses: { type: Boolean, default: false, trim: true },
    type: { type: ObjectId, trim: true, default: null },
    term: { type: Number },
    allTerm: { type: Boolean, default: false },
    //May change the type in session to in ObjectId
    //later on to be consistent with type model
    session: { type: ObjectId, required: true },
    //May change the type in name to in ObjectId
    //later on to be consistent with tyoe model
    currency: { type: String, trim: true, default: "naira" },
    subFees: [
      {
        _id: false,
        subName: { type: String, trim: true },
        subAmount: { type: Number, trim: true },
      },
    ],
    createdAt: { type: Number, default: Date.now },
  },
  virtuals
);

const feeSchemaTotalVirtuals = feeSchema.virtual("total");

feeSchemaTotalVirtuals.get(function () {
  const total = this.subFees.reduce((a, b) => a.subAmount + b.subAmount);
  return total;
});

// feeSchema.virtual();
feeSchema.post("validate", function () {
  if (this.allClasses) {
    Types.find()
      .then((type) => {
        if (type.length > 0 && type[0].class.length > 0) {
          let arr = [];
          type[0].class.forEach((a, b) => {
            arr.push(a._id);
          });
          if (arr.length === type[0].class.length) {
            this.class = arr;
            next();
          } else {
            throw "Ensure you have Classes created or have supplied the right id";
          }
        } else {
          throw "Ensure you have Classes created or have supplied the right id";
        }
      })
      .catch(() => {
        throw "Ensure you have Classes created or have supplied the right id";
      });
  }
  //If allClasses = true, go to types and add all the classes there
  //for save and create functions
  //May use validate here
  //Send details to Types model and perform updates accordingly
});
feeSchema.pre("update", function () {
  //Perform price recalculation if subFees was modified
});
feeSchema.post("delete", function () {
  //Send details to Type model and perform removal at that spot accordingly
});

module.exports = mongoose.model("Fee", feeSchema);
