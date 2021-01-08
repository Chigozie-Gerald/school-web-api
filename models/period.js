const mongoose = require("mongoose");
const {
  subjectType,
  sessionType,
  classNameType,
  termType,
} = require("../controllers/types");
const {
  getSession,
  getTerm,
  getSubject,
} = require("../controllers/types/getTypes");
const Schema = mongoose.Schema;
const schmeOptions = { _id: false };
const discrimPeriod = new Schema({}, { discriminatorKey: "kind", _id: false });
const subjectPeriodSchema = new Schema(
  {
    subject: subjectType,
    start: { type: Number, required: true },
    stop: {
      type: Number,
      required: true,
    },
  },
  schmeOptions
);
const sessionPeriodSchema = new Schema(
  {
    session: sessionType,
    terms: termType,
  },
  schmeOptions
);
const termPeriodSchema = new Schema(
  {
    days: { type: Number, required: true, min: 0, max: 7, default: 5 },
  },
  schmeOptions
);

const periodSchema = new Schema({
  className: classNameType,
  period: [[discrimPeriod]],
  createdAt: { type: Number, default: Date.now, required: true },
});
sessionPeriodSchema.pre("validate", async function (next) {
  if (
    (await getSession(this.session).validator()) &&
    (await getTerm({ term: this.terms, all: true }).validator())
  ) {
    next();
  } else {
    throw { msg: "Validation for Session Period Failed" };
  }
});
subjectPeriodSchema.pre("validate", async function (next) {
  if (await getSubject(this.subject).validator()) {
    next();
  } else {
    throw { msg: "Validation for Subject Period Failed" };
  }
});

const periodPath = periodSchema.path("period");
const TermPeriodScheme = periodPath.discriminator(
  "TermPeriodScheme",
  termPeriodSchema
);
const SessionPeriodScheme = periodPath.discriminator(
  "SessionPeriodScheme",
  sessionPeriodSchema
);
const SubjectPeriodScheme = periodPath.discriminator(
  "SubjectPeriodScheme",
  subjectPeriodSchema
);

const Period = mongoose.model("Periodd", periodSchema);
const SubjectPeriod = mongoose.model("SubjectPeriod", subjectPeriodSchema);
const TermPeriod = mongoose.model("TermPeriod", termPeriodSchema);
const SessionPeriod = mongoose.model("SessionPeriod", sessionPeriodSchema);
module.exports = {
  SubjectPeriod,
  TermPeriod,
  SessionPeriod,
  Period,
};
/**
 In period session :{
   name: "", term:""
 }
 term :[5,5,5]

 [[head: number of terms, session name],[term: term is the number of days: default 5], [],[],[],[],[]]
 
 
 
 day:{

 }
 
 */
