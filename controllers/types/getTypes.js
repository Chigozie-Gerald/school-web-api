const Type = require("../../models/Types").Type;
const Student = require("../../models/student");
const Staff = require("../../models/staff");
const ErrorMsg = " provided is invalid";
const getType = (value, group) => {
  Type.findOne()
    .then((type) => {
      if (type) {
        let result = [];
        switch (group) {
          case "fee": {
            result = type.fee.filter((a) => a === value);
            break;
          }
          case "currency": {
            result = type.currency.filter((a) => a === value);
            break;
          }
          case "arm": {
            result = type.arm.filter((a) => a._id === value);
            break;
          }
          case "category": {
            result = type.category.filter((a) => a._id === value);
            break;
          }
          case "className": {
            result = type.className.filter((a) => a._id === value);
            break;
          }
          case "session": {
            result = type.session.filter((a) => a._id === value && a.active);
            break;
          }
          case "term": {
            result = [type.session.filter((a) => a.active && a.term >= true)];
            break;
          }
          case "subject": {
            result = type.subject.filter((a) => a._id === value);
            break;
          }
          default:
            result = [];
        }
        return result.length > 0;
      } else {
        return new Error({ msg: "No type exists" });
      }
    })
    .catch((err) => {
      throw "Something went wrong";
    });
};
const getStaffFunc = (value) => {
  Staff.findById(value)
    .then((staff) => {
      if (staff) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return err;
    });
};
const getStudentFunc = (value) => {
  Student.findById(value)
    .then((stud) => {
      if (stud) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return err;
    });
};

//Person Groups
exports.getStudent = (value) => ({
  validator: getStudentFunc(value),
  message: "The Student" + ErrorMsg,
});
exports.getStaff = (value) => ({
  validator: getStaffFunc(value),
  message: "The Student" + ErrorMsg,
});

//Concrete Types
exports.getFee = (value) => ({
  validator: getType(value, "fee"),
  message: "The Fee" + ErrorMsg,
});

exports.getCurrency = (value) => ({
  validator: getType(value, "currency"),
  message: "The Currency" + ErrorMsg,
});

exports.getArm = (value) => ({
  validator: getType(value, "arm"),
  message: "The Arm" + ErrorMsg,
});

exports.getCategory = (value) => ({
  validator: getType(value, "category"),
  message: "The Category" + ErrorMsg,
});

exports.getClassName = (value) => ({
  validator: getType(value, "className"),
  message: "The Class" + ErrorMsg,
});

exports.getSession = (value) => ({
  validator: getType(value, "session"),
  message: "The Session" + ErrorMsg + " or is inactive",
});

exports.getTerm = (value) => ({
  validator: getType(value, "term"),
  message: "The term" + ErrorMsg + "/doesn't exist in the active session",
});

exports.getSubject = (value) => ({
  validator: getType(value, "subject"),
  message: "The Subject" + ErrorMsg,
});
