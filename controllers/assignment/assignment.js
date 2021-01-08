const mongoose = require("mongoose");
const Assignment = require("../../models/assignment");

exports.postAssignment = function (req, res) {
  const {
    teacherId,
    className,
    arm,
    session,
    subject,
    title,
    instruction,
    questions,
    dueDate,
    dueTime,
  } = req.body;

  if (!className || !arm || !subject || !questions) {
    res.status(400).send({
      msg: "Please fill in all fields",
    });
  } else {
    var assignment = new Assignment({
      teacherId,
      className,
      arm,
      session,
      subject,
      title,
      instruction,
      questions,
      dueDate,
      dueTime,
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
  const { className, arm, session } = req.body;

  if (!className || !arm || !session) {
    res.status(400).send({
      msg: "Please fill in all fields",
    });
  } else {
    Assignment.find({
      className,
      arm,
      session,
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
  const { _id } = req.body;

  Assignment.deleteOne({
    _id,
    teacherId: req.user.user,
  })
    .then((result) => {
      const num = result.n;
      res.send(
        `${num === 0 ? "No" : num} assignment${num <= 1 ? "" : "s"} ${
          num <= 1 ? "was" : "were"
        } deleted`
      );
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
    title,
    instruction,
    dueDate,
    dueTime,
  } = req.body;
  if (!_id || !className || !arm || !subject || !submit || !time || !text) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    Assignment.updateOne(
      { _id, teacherId: req.user.user },
      { className, arm, subject, title, instruction, dueDate, dueTime },
      { omitUndefined: true }
    )
      .then(() => {
        Assignment.findOne({ _id })
          .then((assign) => {
            if (assign) {
              res.send(assign);
            } else {
              res.status(500).send({
                msg: "Provide the right ID",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              msg: "Something went wrong",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Something went wrong",
        });
      });
  }
};

exports.updateAssignmentQuestion = (req, res) => {
  const { index, newQuestion } = req.body;
  if (typeof index !== "number" || typeof newQuestion !== "string") {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    Assignment.findOne({ teacherId: req.user.user })
      .then((assign) => {
        if (assign) {
          const questionArr = assign.questions.map((elem, n) => {
            if (n === index) {
              elem = newQuestion;
            }
            return elem;
          });

          assign.questions = questionArr;
          assign.save((err, saved) => {
            if (err) {
              res.status(500).send("Something went wrong");
            } else {
              res.send(saved);
            }
          });
        } else {
          res.status(400).send({ msg: "Assignment not found" });
        }
      })
      .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
  }
};

exports.deleteAssignmentQuestion = (req, res) => {
  const { index } = req.body;
  if ((index = "number")) {
    res.status(400).send({ msg: "Incomplete info" });
  }
  Assignment.findOne({ teacherId: req.user.user })
    .then((assign) => {
      if (assign) {
        const questionArr = assign.questions.filter((elem, n) => {
          return n !== index;
        });

        assign.questions = questionArr;
        assign.save((err, saved) => {
          if (err) {
            res.status(500).send("Something went wrong");
          } else {
            res.send(saved);
          }
        });
      } else {
        res.status(400).send({ msg: "Assignment not found" });
      }
    })
    .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
};
/*
Periods
assign
deassign
Every session has a term
every term has a period
every period has classes
every class has an arm

in class period, you have the subject and time

period: {
  session: {},
  term1:{
    period: [
      {
        className:{},
        arm:{},
        subject:[
          {
            maths:{
              
            },
            english:"",
            all the subjects:"",
            subject:"",
          }
        ]
      }
    ]
  },
  term2:{},
  term3:{},
}

*/
