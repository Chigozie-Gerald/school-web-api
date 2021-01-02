//LOGIN
const jwt = require("jsonwebtoken");
const Student = require("../../models/student");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../config/key");
const Staff = require("../../models/staff");

exports.postLogin = function (req, res) {
  console.log("here");
  const { regNumber, password } = req.body;
  if (!regNumber) {
    res.status(400).send({
      msg: "Please fill in your Reg Number",
    });
  } else if (!password) {
    res.status(400).send({
      msg: "Password cannot be left blank",
    });
  } else if (regNumber && password) {
    Student.findOne({ regNumber })
      .then((stud) => {
        if (!stud) {
          res.status(400).send({
            msg: "That Reg Number does not exist",
          });
        } else if (stud) {
          bcrypt.compare(password, stud.password, (err, isMatch) => {
            if (err) {
              res.status(500).send({
                msg: "An error was encountered",
              });
              throw err;
            } else if (isMatch) {
              jwt.sign(
                { user: stud._id },
                config.jwtSecret,
                { expiresIn: "2h" },
                (err, token) => {
                  if (err) {
                    res.status(403).send({
                      msg: "Error Generating Token",
                    });
                  } else {
                    stud["password"] = null;
                    res.send({
                      token,
                      user: stud,
                    });
                  }
                }
              );
            } else {
              res.status(400).send({
                msg: "Password Incorrect",
              });
            }
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          msg: "That Reg Number does not exist",
        });
      });
  }
};
exports.staffPostLogin = function (req, res) {
  console.log("here");
  const { staffId, password } = req.body;
  if (!staffId) {
    res.status(400).send({
      msg: "Please fill in your Staff ID",
    });
  } else if (!password) {
    res.status(400).send({
      msg: "Password cannot be left blank",
    });
  } else if (staffId && password) {
    Staff.findOne({ staffId })
      .then((staff) => {
        if (!staff) {
          res.status(400).send({
            msg: "That Staff ID does not exist",
          });
        } else if (staff) {
          bcrypt.compare(password, staff.password, (err, isMatch) => {
            if (err) {
              res.status(500).send({
                msg: "An error was encountered",
              });
              throw err;
            } else if (isMatch) {
              jwt.sign(
                { user: staff._id },
                config.jwtSecret,
                { expiresIn: "2d" },
                (err, token) => {
                  if (err) {
                    res.status(403).send({
                      msg: "Error Generating Token",
                    });
                  } else {
                    staff["password"] = null;
                    res.send({
                      token,
                      user: staff,
                    });
                  }
                }
              );
            } else {
              res.status(400).send({
                msg: "Password Incorrect",
              });
            }
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          msg: "That Reg Number does not exist",
        });
      });
  }
};

exports.showStudent = function (req, res) {
  const id = req.params.student_id;
  Student.findOne({ _id: id }, (err, student) => {
    if (err) {
      res.status(400).send({
        msg: "Student doesn't exist",
      });
    } else if (student) {
      res.send(student);
    }
  });
};
exports.showStaff = function (req, res) {
  const id = req.params.staff_id;
  Staff.findOne({ _id: id }, (err, staff) => {
    if (err) {
      res.status(400).send({
        msg: "Staff doesn't exist",
      });
    } else if (staff) {
      res.send(staff);
    }
  });
};
