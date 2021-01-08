const mongoose = require("mongoose");
const { virtuals } = require(".");
const Schema = mongoose.Schema;

//Nore tyoes -- subject, arm, category (art, science, commercial)
const typeSessionSchema = new Schema({
  title: { type: String, unique: true, required: true },
  term: { type: Number, default: 3, required: true },
  active: { type: Boolean, default: false, required: true },
  //Silent active can only be set by the developer and its for
  //Posting results only
  silentActive: { type: Boolean, default: false, required: true },
  createdAt: { type: Number, default: Date.now, required: true },
});
const typeSubjectSchema = new Schema({
  title: { type: String, unique: true, required: true },
  senior: { type: Boolean, default: false },
  all: { type: Boolean, default: false },
  lastSession: typeSessionSchema,
});
const typeCategorySchema = new Schema({
  title: { type: String, unique: true, required: true },
  senior: { type: Boolean, default: true },
  lastSession: typeSessionSchema,
});
const typeArmSchema = new Schema({
  title: { type: String, unique: true, required: true },
  lastSession: typeSessionSchema,
});
const typeClassNameSchema = new Schema({
  title: { type: String, unique: true, required: true },
  lastSession: typeSessionSchema,
  senior: { type: Boolean, required: true },
  createdAt: { type: Number, default: Date.now, required: true },
});

const typesSchema = new Schema(
  {
    fee: [
      {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: "School Fees",
      },
    ],
    currency: [
      {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: "naira",
      },
    ],
    arm: [{ type: typeArmSchema, required: true }],
    subject: [{ type: typeSubjectSchema, required: true }],
    //Category like art, science, commercial
    category: [{ type: typeCategorySchema, required: true }],
    className: [{ type: typeClassNameSchema, required: true }],
    session: [{ type: typeSessionSchema, required: true }],
  },
  virtuals
);

typesSchema.pre("validate", function (next) {
  if (this.isModified("session")) {
    const sess = this.session;
    if (sess.length > 0) {
      let latest = { item: null, time: 0 };
      for (let a = 0; a < sess.length; a++) {
        const element = sess[a];
        this.session[a].active = false;
        if (element.createdAt > latest.time) {
          latest = { item: a, time: element.createdAt };
        }
        if (a === sess.length - 1) {
          this.session[latest.item].active = true;
        }
      }
      next();
    } else {
      this.active = true;
      next();
    }
  }
  next();
});
class Finder {
  constructor(typeSect) {
    if (!typeSect) {
      throw new Error("Provide Type Sect");
    }
    this.typeSect = typeSect;
  }
  iType = mongoose.model("Type", typesSchema);
  findOne = (value) =>
    new Promise((resolve, reject) => {
      //value is an object
      if (!Object.prototype.isPrototypeOf(value)) {
        reject("Invalid findOne Argument");
      } else {
        this.iType
          .findOne()
          .then((type) => {
            if (type) {
              try {
                if (type[this.typeSect].length > 0) {
                  let keyArray = Object.keys(value);
                  let newElem = null;
                  for (let a = 0; a < type[this.typeSect].length; a++) {
                    const elem = type[this.typeSect][a];
                    const checker = keyArray.some((key) => {
                      return elem[key] != value[key];
                    });
                    if (!checker && !newElem) {
                      newElem = elem;
                      break;
                    }
                  }
                  resolve(newElem);
                } else {
                  resolve(null);
                }
              } catch {
                reject("Something went wrong in types");
              }
            } else {
              resolve(null);
            }
          })
          .catch((err) =>
            reject("Something went wrong on findOne Finder Class")
          );
      }
    });

  find = () =>
    new Promise((resolve, reject) => {
      this.iType
        .findOne()
        .then((type) => {
          if (type) {
            resolve(type[this.typeSect]);
          } else {
            resolve([]);
          }
        })
        .catch((err) => reject(err));
    });
}

exports.TypeSubject = new Finder("subject");
exports.TypeCategory = new Finder("category");
exports.TypeArm = new Finder("arm");
exports.TypeClassName = new Finder("className");
exports.TypeSession = new Finder("session");
exports.Type = mongoose.model("Type", typesSchema);

//Types should be one the first things to do before other registration
