const Type = require("../../models/Types").Type;
const Student = require("../../models/student");
const Staff = require("../../models/staff");
const ErrorMsg = " provided is invalid";
const getType = (value, group) => {
  return new Promise((resolve, reject) => {
    Type.findOne()
      .then((type) => {
        if (type) {
          let result = [];
          let original = false;
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
              result = type.arm.filter((a) => a._id.toString() == value);
              break;
            }
            case "category": {
              result = type.category.filter((a) => a._id.toString() == value);
              break;
            }
            case "className": {
              //Check the class and return if the stuff corresponds
              if (Object.prototype.isPrototypeOf(value)) {
                if (String.prototype.isPrototypeOf(value.senior)) {
                  result = type.className.filter(
                    (a) => a._id.toString() == value.className
                  );
                } else {
                  result = type.className.filter(
                    (a) =>
                      a._id.toString() == value.className &&
                      a.senior === value.senior
                  );
                }
              } else {
                result = type.className.filter(
                  (a) => a._id.toString() == value
                );
              }
              break;
            }
            case "senior": {
              result = type.subject.filter((a) => a._id.toString() == value);
              if (result.length > 0) {
                if (result[0].all) {
                  original = true;
                  result = "all";
                }
              }
              break;
            }
            case "session": {
              result = type.session.filter(
                (a) => a._id.toString() == value && a.active
              );
              break;
            }
            case "term": {
              result = type.session.filter((a) => {
                if (Object.prototype.isPrototypeOf(value) && value.all) {
                  return a.active && a.term == value.term;
                } else {
                  return a.active && a.term >= value;
                }
              });
              break;
            }
            case "subject": {
              result = type.subject.filter((a) => a._id.toString() == value);
              break;
            }
            default:
              result = [];
          }
          if (original) {
            resolve(result);
          } else {
            resolve(result.length > 0);
          }
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject("Something went wrong");
      });
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
exports.getStudent = () => ({
  validator: (value) => getStudentFunc(value),
  message: "The Student" + ErrorMsg,
});
exports.getStaff = () => ({
  validator: (value) => getStaffFunc(value),
  message: "The Student" + ErrorMsg,
});

//Concrete Types
exports.getFee = () => ({
  validator: (value) => getType(value, "fee"),
  message: "The Fee" + ErrorMsg,
});

exports.getCurrency = () => ({
  validator: (value) => getType(value, "currency"),
  message: "The Currency" + ErrorMsg,
});

exports.getArm = () => ({
  validator: (value) => getType(value, "arm"),
  message: "The Arm" + ErrorMsg,
});

exports.getCategory = () => ({
  validator: (value) => getType(value, "category"),
  message: "The Category" + ErrorMsg,
});

exports.getClassName = () => ({
  validator: (value) => getType(value, "className"),
  message: "The Class" + ErrorMsg,
});

exports.getSession = () => ({
  validator: (value) => getType(value, "session"),
  message: "The Session" + ErrorMsg + " or is inactive",
});

exports.getTerm = () => ({
  validator: (value) => getType(value, "term"),
  message: "The term" + ErrorMsg + "/ doesn't exist in the active session",
});

exports.getSubject = () => ({
  validator: (value) => getType(value, "subject"),
  message: "The Subject" + ErrorMsg,
});
exports.getSubject = () => ({
  validator: (value) => getType(value, "subject"),
  message: "The Subject" + ErrorMsg,
});

exports.isSeniorSub = (value) => getType(value, "senior");
