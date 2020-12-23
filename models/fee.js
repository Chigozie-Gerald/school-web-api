const mongoose = require("mongoose");
const Type = require("./Types");
const { virtuals } = require(".");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const objCheck = require("../middleware/section").objCheck;
const check = require("../middleware/section").check;

feeSchema = new Schema(
  {
    name: { type: ObjectId, required: true },
    className: [{ type: ObjectId, required: true }],
    student: [{ type: ObjectId, required: true }],
    staffId: { type: ObjectId, required: true },
    allClasses: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    compulsory: { type: Boolean },
    online: { type: Boolean, default: true },
    //check if Term exists in the session in types
    term: [{ type: Number, required: true }],
    session: { type: ObjectId, required: true },
    currency: { type: ObjectId, default: "naira" },
    subFees: [
      {
        _id: false,
        subName: { type: String, trim: true, required: true },
        subAmount: { type: Number, required: true },
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

feeSchema.pre("validate", function (next) {
  Type.find()
    .then((typeResult) => {
      if (typeResult.length > 0) {
        const type = typeResult[0];

        //Fee (name)
        const feeCheck = check(this.name, type.fee);
        if (!feeCheck) {
          throw "Fee not found in Types";
        } else {
          this.name = feeCheck;
        }
        //Session
        const sesCheck = objCheck(this.session, type.session, true, this.term);
        if (!sesCheck) {
          throw "Session not found in Types or Session found but incorrect term";
        } else {
          this.session = sesCheck;
        }
        //Classes
        const classCheck = objCheck(this.className, type.className);
        if (!classCheck) {
          throw "Class not found in Types";
        } else {
          this.className = classCheck;
        }
        //Currency
        const curCheck = check(this.currency, type.currency);
        if (!curCheck) {
          throw "Currency not found in Types";
        } else {
          this.currency = curCheck;
        }
        //All Classes
        if (this.allClasses) {
          if (type.className.length > 0) {
            let arr = [];
            type.className.forEach((a) => {
              arr.push(a._id);
            });
            if (arr.length === type.className.length) {
              this.className = arr;
            } else {
              throw "Something went wrong during operation";
            }
          } else {
            throw "Ensure you have Classes created";
          }
        }
      } else {
        throw "Create a 'Type' before executing this action";
      }
      next();
    })
    .catch(() => {
      throw "Ensure you have Classes created or have supplied the right id";
    });
});
feeSchema.pre("update", async function () {
  //Do query here
  /*
  const doc = await Fee.findOne(this.getQuery())
  */
  const doc = await Fee.findOne(this.getQuery());
  Type.find()
    .then((typeResult) => {
      if (typeResult.length > 0) {
        const type = typeResult[0];

        //Is Deleted (soft delete)
        if (doc.isModified("isDeleted")) {
          const deleteArr = type.fee.filter((elem) => elem !== doc.name);
          if (deleteArr === type.fee.length) {
            throw "Something is wrong with your fees type array";
          }
        }
        const feeCheck = check(doc.name, type.fee);
        if (!feeCheck) {
          throw "Fee not found in Types";
        } else {
          doc.name = feeCheck;
        }
        //Session
        const sesCheck = objCheck(doc.session, type.session, true, doc.term);
        if (!sesCheck) {
          throw "Session not found in Types or Session found but incorrect term";
        } else {
          doc.session = sesCheck;
        }
        //Classes
        const classCheck = objCheck(doc.className, type.className);
        if (!classCheck) {
          throw "Class not found in Types";
        } else {
          doc.className = classCheck;
        }
        //Currency
        const curCheck = check(doc.currency, type.currency);
        if (!curCheck) {
          throw "Currency not found in Types";
        } else {
          doc.currency = curCheck;
        }
        //All Classes
        if (doc.allClasses) {
          if (type.className.length > 0) {
            let arr = [];
            type.className.forEach((a) => {
              arr.push(a._id);
            });
            if (arr.length === type.className.length) {
              doc.className = arr;
            } else {
              throw "Something went wrong during operation";
            }
          } else {
            throw "Ensure you have Classes created";
          }
        }
        next();
      } else {
        throw "Create a 'Type' before executing this operation";
      }
    })
    .catch(() => {
      throw "Something went wrong";
    });
  //Send details to Type model and perform removal at that spot accordingly
});

module.exports = mongoose.model("Fee", feeSchema);
