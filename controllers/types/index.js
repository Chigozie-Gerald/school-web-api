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
  validate: (value) => getFee(value),
  required: true,
};
// currency
exports.currencyType = {
  type: String,
  validate: (value) => getCurrency(value),
  required: true,
};
// arm
exports.armType = {
  type: ObjectId,
  ref: "Type.arm",
  validate: (value) => getArm(value),
  required: true,
};
// category
exports.categoryType = {
  type: ObjectId,
  ref: "Type.category",
  validate: (value) => getCategory(value),
};
// classname
exports.classNameType = {
  type: ObjectId,
  ref: "Type.className",
  validate: (value) => getClassName(value),
  required: true,
};
// session
exports.sessionType = {
  type: ObjectId,
  ref: "Type.session",
  validate: (value) => getSession(value),
  required: true,
};
// term
exports.termType = {
  type: String,
  validate: (value) => getTerm(value),
  required: true,
};
// subject
exports.subjectType = {
  type: ObjectId,
  ref: "Type.subject",
  validate: (value) => getSubject(value),
  required: true,
};
//Staff
exports.staffType = {
  type: ObjectId,
  ref: "Staff",
  validate: (value) => getStaff(value),
  required: true,
};
//Student
exports.studentType = {
  type: ObjectId,
  ref: "Student",
  validate: (value) => getStudent(value),
  required: true,
};
