mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/key");
const School = require("../../models/school");
const Staff = require("../../models/staff");
const Student = require("../../models/student");
const NewsReport = require("../../models/news");
const { default: validator } = require("validator");

//REGISTER
exports.getStudent = function (req, res) {
  Student.find({})
    .sort({ firstname: 1 })
    .then((student) => {
      if (student.length > 0) {
        res.send(student);
      } else {
        res.status(400).send({ student: "No Student Registered Yet" });
      }
    })
    .catch((err) => console.log(err));
};

exports.postRegister = (req, res) => {
  const {
    lastname,
    dob,
    firstname,
    regNumber,
    className,
    arm,
    password,
  } = req.body;

  if (
    !lastname ||
    !firstname ||
    !regNumber ||
    !className ||
    !arm ||
    !password
  ) {
    res.status(400).send({
      msg: "Incomplete credentials",
    });
  } else {
    Student.findOne({ regNumber: regNumber }).then((stud) => {
      if (stud) {
        res.status(400).send({ msg: "Student already exists" });
      } else if (!stud) {
        student = new Student({
          lastname,
          dob,
          firstname,
          regNumber,
          className,
          arm,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            res.status(500).send({
              msg: "Something went wrong while generating salt for hash",
            });
          } else if (salt) {
            bcrypt.hash(student.password, salt, (err, hash) => {
              if (err) {
                res.status(500).json({ msg: "Couldn't generate hash" });
              } else {
                student.password = hash;

                student.save((err, newStudent) => {
                  if (err) {
                    res.status(500).send({
                      msg: "An error occured, please try again!",
                    });
                  } else {
                    jwt.sign(
                      { user: newStudent._id },
                      config.jwtSecret,
                      { expiresIn: "2h" },
                      (err, token) => {
                        if (err) {
                          res.status(403).json({
                            msg: "Error Generating Token",
                          });
                        } else {
                          newStudent["password"] = null;
                          res.json({
                            token,
                            user: newStudent,
                          });
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  }
};

exports.little = (req, res) => {
  const { stateOfOrigin, _id, nationality } = req.body;
  Student.findOne({ _id })
    .then((ress) => {
      Student.updateOne(
        { _id },
        { $set: { $set: { stateOfOrigin } }, nationality }
      )
        .then((stud) => {
          res.send(stud);
        })
        .catch((err) => res.status(500).send("Something went wrong" + err));
    })
    .catch((err) => res.status(500).send("Something went wrong" + err));
};
exports.editProfile = function (req, res) {
  const {
    dob,
    firstname,
    lastname,
    arm,
    regNumber,
    middlename,
    address,
    email,
    sex,
    nationality,
    stateOfOrigin,
    lga,
    religion,
  } = req.body;
  if (!regNumber) {
    res.status(400).send({
      msg: "Please fill in the required fields(s)",
    });
  } else
    Student.updateOne(
      { regNumber },
      {
        firstname,
        lastname,
        dob,
        arm,
        sex,
        middlename,
        address,
        email,
        nationality,
        stateOfOrigin,
        lga,
        religion,
      },
      { omitUndefined: true }
    )
      .then((stud) => {
        if (stud) {
          Student.find({ regNumber })
            .then((student) => {
              if (student.length > 0) {
                res.send(student);
              } else {
                res.status(400).send({ student: "No such student" });
              }
            })
            .catch((err) => console.log(err));
        } else {
          res.status(400).send({
            msg:
              "Couldn't find student \n Please check if that Reg Number is correct",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          msg: "Something went wrong",
        });
      });
};

exports.forgotten_password = (req, res) => {
  const { regNumber } = req.body;
  if (!regNumber) {
    res.status(400).send({
      msg: "Incomplete Information",
    });
  } else if (regNumber) {
    Student.findOne({ regNumber })
      .then((stud) => {
        if (stud) {
          jwt.sign(
            { user: stud._id },
            config.resetSecret,
            { expiresIn: "2h" },
            (err, token) => {
              if (err) {
                res.status(500).send({
                  msg: "Something went wrong",
                });
              } else if (token) {
                Student.updateOne({ regNumber }, { resetToken: token })
                  .then((success) => {
                    if (success) {
                      res.send({
                        token,
                      });
                    } else {
                      res.status(500).send({
                        msg: "Something went wrong",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).send({
                      msg: "Something went wrong",
                    });
                  });
              }
            }
          );
        } else {
          res.status(400).send({
            msg: "Student doesn't exist",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          msg: "Something went wrong",
        });
      });
  }
};

exports.changePassword = function (req, res) {
  const { password } = req.body;
  const token = req.params.token;

  if (!password || !token) {
    res.status(400).send({
      msg: "Incomplete credentials",
    });
  } else {
    jwt.verify(token, config.resetSecret, (err, crypt) => {
      if (err) {
        res.status(500).send({
          msg: "Something went wrong",
        });
      } else if (crypt) {
        Student.findOne({ _id: crypt.user, resetToken: token })
          .then((stud) => {
            if (stud) {
              bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                  res.status(500).send({
                    msg: "Something went wrong",
                  });
                } else if (salt) {
                  bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                      res.status(500).send({
                        msg: "Something went wrong, couldn't generate hash",
                      });
                      throw err;
                    } else if (hash) {
                      stud.password = hash;
                      stud.resetToken = "";
                      stud.save((err, newStud) => {
                        if (err) {
                          res.status(500).send({
                            msg: "Something went wrong",
                          });
                        } else if (newStud) {
                          res.send({
                            msg: "Password updated successfully to " + password,
                            stud: newStud,
                          });
                        }
                      });
                    }
                  });
                }
              });
            } else if (!stud) {
              res.status(500).send({
                msg: "Something went wrong",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              msg: "Something went wrong",
            });
          });
      }
    });
  }
};

exports.registerSchool = (req, res) => {
  const {
    name,
    motto,
    aboutSchool,
    aboutProp,
    schoolMail,
    address,
    welcome,
    mapDetails,
    uploaderId,
    uploaderPassword,
  } = req.body;

  if (
    !name ||
    !motto ||
    !address ||
    !schoolMail ||
    !aboutSchool ||
    !aboutProp
  ) {
    res.status(400).send({
      msg: "Incomplete details, couldn't create school",
    });
  } else {
    School.findOne()
      .then((sch) => {
        if (sch) {
          res.status(400).send({ msg: "School already exists", sch });
        } else {
          var newSchool = new School({
            name,
            motto,
            aboutSchool,
            welcome,
            aboutProp,
            schoolMail,
            address,
            mapDetails,
            uploaderId,
            uploaderPassword,
          });
          newSchool
            .save()
            .then((newSch) =>
              res.send({
                msg: "creating new school",
                newSch,
              })
            )
            .catch((err) => {
              res.status(500).send({
                msg: err.message,
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          msg: err.message,
        });
      });
  }
};

exports.registerStaff = (req, res) => {
  const {
    firstname,
    lastname,
    role,
    editor,
    sex,
    lga,
    teacher,
    address,
    middlename,
    qualifications,
    phoneNumber,
    email,
    formteacher,
    subject,
    maritalStatus,
    title,
    nationality,
    dob,
    stateOfOrigin,
    religion,
    password,
  } = req.body;

  if (!email || !validator.isEmail(email) || !firstname || !lastname) {
    res.status(400).send({
      msg: "Incomplete Info",
    });
  } else {
    Staff.findOne({ email })
      .then((stf) => {
        if (stf) {
          Staff.deleteMany()
            .then((_) =>
              res.status(400).send({
                msg: "Staff alrerady exists",
                stf,
              })
            )
            .catch((err) => res.status(500).send({ err }));
        } else {
          const newStaff = new Staff({
            firstname,
            lastname,
            role,
            editor,
            sex,
            lga,
            teacher,
            address,
            middlename,
            qualifications,
            phoneNumber,
            email,
            formteacher,
            subject,
            maritalStatus,
            title,
            nationality,
            dob,
            stateOfOrigin,
            religion,
            password,
          });
          newStaff.password = bcrypt.hashSync(newStaff.password);
          newStaff.save((err, saved) => {
            if (err) {
              console.log(firstname);
              res.status(500).send({
                msg: "Something went wrong",
                err,
              });
            } else {
              res.send({
                saved,
              });
            }
          });
        }
      })
      .catch((err) => res.send(err + "hh"));
  }
};
