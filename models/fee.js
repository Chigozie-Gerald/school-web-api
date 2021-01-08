const mongoose = require("mongoose");
const Type = require("./Types");
const { virtuals } = require(".");
const Schema = mongoose.Schema;
const {
  classNameType,
  sessionType,
  staffType,
  studentType,
  categoryType,
} = require("../controllers/types/.");

//Add category (commercial, science, art)
const feeSchema = new Schema(
  {
    name: { type: String, required: true },
    isCategorized: { type: Boolean, default: false },
    category: categoryType,
    className: [classNameType],
    student: [studentType],
    staffId: staffType,
    allClasses: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    compulsory: { type: Boolean },
    //Online means to be paid online
    online: { type: Boolean, default: true },
    term: [{ type: Number, required: true }],
    session: sessionType,
    currency: { type: String, default: "naira" },
    subFees: [
      {
        _id: false,
        subName: { type: String, trim: true, unique: true, required: true },
        subAmount: { type: Number, required: true },
      },
    ],
    createdAt: { type: Number, default: Date.now },
  },
  virtuals
);

const feeSchemaTotalVirtuals = feeSchema.virtual("total");
const feeSchemaStudentVirtuals = feeSchema.virtual("paidBy");

feeSchemaTotalVirtuals.get(function () {
  const total = this.subFees.reduce((a, b) => a.subAmount + b.subAmount);
  return total;
});
feeSchemaStudentVirtuals.get(function () {
  const total = this.tudent.length;
  return total;
});

feeSchema.pre("validate", function (next) {
  Type.findOne()
    .then((type) => {
      if (type) {
        //All Classes
        if (this.allClasses) {
          if (type.className.length > 0) {
            let arr = [];
            type.className.forEach((a) => {
              arr.push(a._id);
            });
            this.className = arr;
          } else {
            throw "Ensure you have Classes created";
          }
        }
        if (!isCategorized && this.category) {
          throw "This fee was selected as not categorized and a category was sent. Do you want to categorize it?";
        }
        next();
      } else {
        throw "Create a 'Type' before executing this action";
      }
    })
    .catch(() => {
      throw "Ensure you have Classes created or have supplied the right id";
    });
});
feeSchema.pre("update", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  const data = this.getUpdate();
  const queryKeys = Object.keys(data);
  let queryArr = [];
  const checkQuery = (arr, innerData = data) => {
    arr.map((elem) => {
      if (elem.startsWith("$")) {
        checkQuery(Object.keys(innerData[elem]), innerData[elem]);
      } else {
        queryArr.push(elem);
      }
    });
  };
  checkQuery(queryKeys);
  const isModified = (value) => queryArr.includes(value);
  Type.find()
    .then((type) => {
      if (type) {
        //Is Deleted (soft delete)
        if (isModified("isDeleted")) {
          const deleteArr = type.fee.filter((elem) => elem !== doc.name);
          type.fee = deleteArr;
        }

        //All Classes
        if (data.allClasses) {
          if (type.className.length > 0) {
            let arr = [];
            type.className.forEach((a) => {
              arr.push(a._id);
            });
            data.className = arr;
          } else {
            throw "Ensure you have Classes created";
          }
        }
        if (!this.isCategorized && this.category) {
          throw "This fee was selected as not categorized and a category was sent. Do you want to categorize it?";
        }

        type.save((err, save) => {
          if (err) {
            throw err;
          } else {
            next();
          }
        });
      } else {
        throw "Create a 'Type' before executing this operation";
      }
    })
    .catch(() => {
      throw "Something went wrong";
    });
});

module.exports = mongoose.model("Fee", feeSchema);
