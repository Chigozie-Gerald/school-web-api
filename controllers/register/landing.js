mongoose = require("mongoose");
var Student = require("../../models/student");
var School = require("../../models/school");
const jwt = require("jsonwebtoken");

exports.homepage = function (req, res) {
  School.find({})
    .then((sch) => {
      if (sch.length > 0) {
        let welcome = sch[0].welcome;
        console.log(welcome);
        res.send(`Welcome \n to our School`);
      } else {
        res.send("Welcome \n to our School");
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
    });
};

exports.newSchool = function (req, res) {
  const { name, welcome, headTeacher, location, total, address } = req.body;
  if (!name || !welcome || !headTeacher || !location || !total || !address) {
    res.status(400).send({
      msg: "Something went wrong",
    });
  } else {
    var newSchool = new School({
      name,
      welcome,
      headTeacher,
      location,
      total,
      address,
    });
    newSchool.save((err, saved) => {
      if (err) {
        res.status(400).send({
          msg: "Something went wrong",
        });
      } else if (saved) {
        res.send({
          msg: "New School created",
        });
      }
    });
  }
};

exports.userData = function (req, res) {
  Student.findById(req.user.user)
    .select("-password")
    .then((user) => {
      if (user) {
        res.json({ user });
      } else res.status(400).json({ msg: "User is Unavailable" });
    })
    .catch((err) => {
      res.status(400).json({ msg: "Something went wrong" });
    });
};
