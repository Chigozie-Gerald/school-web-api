//LOGIN
const jwt = require("jsonwebtoken");
const Student = require("../../models/student");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../config/key");

exports.postLogin = function (req, res) {
  console.log("here");
  const { regNumber, password } = req.body;
  if (!regNumber) {
    res.status(400).json({
      msg: "Please fill in your Reg Number",
    });
  } else if (!password) {
    res.status(400).json({
      msg: "Password cannot be left blank",
    });
  } else if (regNumber && password) {
    Student.findOne({ regNumber })
      .then((stud) => {
        if (!stud) {
          res.status(400).json({
            msg: "That Reg Number does not exist",
          });
        } else if (stud) {
          bcrypt.compare(password, stud.password, (err, isMatch) => {
            if (err) {
              res.status(500).json({
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
                    res.status(403).json({
                      msg: "Error Generating Token",
                    });
                  } else {
                    stud["password"] = null;
                    res.json({
                      token,
                      user: stud,
                    });
                  }
                }
              );
            } else {
              res.status(400).json({
                msg: "Password Incorrect",
              });
            }
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
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
