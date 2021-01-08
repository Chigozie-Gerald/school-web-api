const {
  getFee,
  getCurrency,
  getArm,
  getCategory,
  getClassName,
  getSession,
  getTerm,
  getSubject,
  getStaff,
  getStudent,
} = require("./getTypes");
const ObjectId = require("mongoose").Types.ObjectId;

// fee
exports.feeType = {
  type: String,
  validate: getFee(),
  required: true,
};
// currency
exports.currencyType = {
  type: String,
  validate: getCurrency(),
  required: true,
};
// arm
exports.armType = {
  type: ObjectId,
  ref: "Type.arm",
  validate: getArm(),
  required: true,
};
// category
exports.categoryType = {
  type: ObjectId,
  ref: "Type.category",
  validate: getCategory(),
};
// classname
exports.classNameType = {
  type: ObjectId,
  ref: "Type.className",
  validate: getClassName(),
  required: true,
};
// session
exports.sessionType = {
  type: ObjectId,
  ref: "Type.session",
  validate: getSession(),
  required: true,
};
// term
exports.termType = {
  type: Number,
  validate: getTerm(),
  required: true,
};
// subject
exports.subjectType = {
  type: ObjectId,
  ref: "Type.subject",
  validate: getSubject(),
  required: true,
};
//Staff
exports.staffType = {
  type: ObjectId,
  ref: "Staff",
  validate: getStaff(),
  required: true,
};
//Student
exports.studentType = {
  type: ObjectId,
  ref: "Student",
  validate: getStudent(),
  required: true,
};
