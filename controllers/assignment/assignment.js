const mongoose = require("mongoose");
const Assignment = require("../../models/assignment");

exports.postAssignment = function (req, res) {
  const { className, arm, subject, submit, time, teacherId, text } = req.body;

  if (!className || !arm || !subject || !text) {
    res.status(400).send({
      msg: "Please fill in all fields",
    });
  } else {
    var assignment = new Assignment({
      className,
      arm,
      subject,
      submit,
      text,
      time,
      teacherId,
    });

    assignment.save((err, newAssignment) => {
      if (err) {
        res.status(500).send({
          msg: "Couldn't create assignment, try again",
        });
      } else if (newAssignment) {
        res.send(newAssignment);
      }
    });
  }
};

exports.getAssignment = function (req, res) {
  const { className, arm } = req.body;

  if (!className || !arm) {
    res.status(400).send({
      msg: "Please fill in all fields",
    });
  } else {
    Assignment.find({
      className,
      arm,
    })
      .sort({ createdAt: -1 })
      .then((list) => {
        if (list.length > 0) {
          res.send(list);
        } else {
          res.status(400).send({
            msg: "No assignment yet",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Something went wrong. Please try again",
        });
        throw err;
      });
  }
};

exports.deleteAssignment = function (req, res) {
  const { _id, teacherId } = req.body;

  Assignment.deleteOne({
    _id,
    teacherId,
  })
    .then((result) => {
      Assignment.find({
        teacherId,
      })
        .sort({ createdAt: -1 })
        .then((assigns) => {
          if (assigns.length > 0) {
            res.send(assigns);
          } else {
            res.status(400).send({
              msg: "No assignments",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            msg: "Something went wrong",
          });
          throw err;
        });
    })
    .catch((err) => {
      res.status(400).send({
        msg: "Couldnt not delete assignment, try again later",
      });
      throw err;
    });
};

exports.assignment = function (req, res) {
  Assignment.find({})
    .sort({ createdAt: -1 })
    .then((assigns) => {
      res.send(assigns);
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
      throw err;
    });
};

exports.updateAssignment = function (req, res) {
  const {
    _id,
    className,
    arm,
    subject,
    submit,
    time,
    text,
    teacherId,
  } = req.body;
  if (!_id || !className || !arm || !subject || !submit || !time || !text) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    Assignment.updateOne(
      { _id, teacherId },
      { className, arm, subject, submit, time, text }
    )
      .then((assignUpdate) => {
        Assignment.find({ _id })
          .then((assigns) => {
            if (assigns) {
              res.send(assigns);
            } else {
              res.status(500).send({
                msg: "Something went wrong",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              msg: "Something went wrong",
            });
            throw err;
          });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Something went wrong",
        });
        throw err;
      });
  }
};
