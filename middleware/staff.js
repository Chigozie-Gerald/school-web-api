const Staff = require("../models/staff");

exports.subjectTeacher = (req, res, next) => {
  const { staffId, subjectId, classNameId };

  Staff.findOne({ _id: staffId })
    .then((staff) => {
      if (staff) {
        let seen = false;
        for (let i = 0; i < staff.subject.length; i++) {
          const element = staff.subject[i];
          if (element.name === subjectId && element.className === classNameId) {
            seen = true;
            break;
          }
        }
        if (seen) {
          req.staffDetails = staff;
          next();
        } else {
          res.status(400).send({
            msg:
              "You can't perform the operation on this class because you're not the class teacher",
          });
        }
      } else {
        res.status(400).send({
          msg: "Staff doesn't exist",
        });
      }
    })
    .catch(() => res.status(500).send("Something wrong"));
  /*
  *Must be a staff
  *Must have a particular subject in a particular class

  ***Need id, classNameId, subjectId
  */
};
exports.staff = (req, res, next) => {
  const { staffId } = req.body;
  Staff.findOne({ _id: staffId })
    .then((staff) => {
      if (staff) {
        req.staffDetails = staff;
        next();
      } else {
        res.status(400).send({
          msg: "Staff doesn't exist",
        });
      }
    })
    .catch(() => res.status(500).send("Something wrong"));
};
exports.formTeacher = (req, res, next) => {
  //Class, id
  const { staffId, classNameId } = req.body;
  Staff.findOne({ _id: staffId })
    .then((staff) => {
      if (staff) {
        let seen = false;
        for (let i = 0; i < staff.formTeacher.length; i++) {
          const element = staff.formTeacher[i];
          if (element.className === classNameId) {
            seen = true;
            break;
          }
        }

        if (seen) {
          req.staffDetails = staff;
          next();
        } else {
          res.status(400).send({
            msg:
              "You're not the class teacher and so can't proceed with the operation",
          });
        }
      } else {
        res.status(400).send({
          msg: "Staff doesn't exist",
        });
      }
    })
    .catch(() => res.status(500).send("Something wrong"));
};
