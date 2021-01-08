var Student = require("../../models/student");
const Result = require("../../models/result");
const { ResultMaker, getSession } = require("./resultClass");
const { isArray } = require("../types/create");

const errorMsg = "Something went wrong";

exports.getAllNewResult = (req, res) => {
  Result.find()
    .then((results) => res.send({ results }))
    .catch(() => res.status(500).send({ msg: errorMsg }));
};

exports.getNewResult = (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    res.status(500).send({
      msg: "Incomplete Info",
    });
  } else {
    Result.findOne({ studentId })
      .then((results) => res.send(results))
      .catch(() => res.status(500).send({ msg: errorMsg }));
  }
};

exports.deleteAllNewResult = (req, res) => {
  Result.deleteMany()
    .then(() => res.send("All Results deleted"))
    .catch(() => res.status(500).send({ msg: errorMsg }));
};

exports.deleteLastNewResult = (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    Result.findOne({ studentId })
      .then((port) => {
        if (port.result.length > 0) {
          if (port.result.length === 1) {
            Result.deleteOne({ studentId })
              .then(() =>
                res.send(
                  "Entirely result deleted because only one result existed"
                )
              )
              .catch(() => res.status(500).send(errorMsg));
          } else {
            port.result.pop();
            port.save((err, saved) => {
              if (err) {
                res.status(500).send({ errorMsg });
              } else {
                res.send(saved);
              }
            });
          }
        } else {
          res.status(500).send({
            msg: "No result available to delete",
          });
        }
      })
      .catch(() => res.status(500).send({ msg: errorMsg }));
  }
};

exports.newResult = (req, res) => {
  const { studentId, result } = req.body;
  if (!studentId || !Array.prototype.isPrototypeOf(result) || !result.length) {
    res.status(500).send({ msg: "Incomplete info" });
  } else {
    try {
      getSession()
        .then((sess) => {
          if (isArray(sess) && sess.length > 0) {
            const new_result = new ResultMaker(sess).components(result);
            const resultCreate = new_result.result;
            console.log("hird");
            Result.findOneAndUpdate(
              { studentId },
              {
                $push: { result: resultCreate },
                $set: { _id: studentId },
              },
              { new: true, upsert: true, useFindAndModify: false }
            )
              .then((rst) => res.send({ rst }))
              .catch((err) =>
                res.status(500).send({
                  msg: errorMsg,
                  err,
                })
              );
          } else {
            res.status(500).send("Something went wrong");
          }
        })
        .catch((err) => res.status(500).send(err));
    } catch (err) {
      console.log(err, "er");
      res.status(500).send(`${err} kfkfkfk`);
    }
  }
};

exports.editResultSub = (req, res) => {
  //Can only edit last session
  //Maybe only the developer will be able to edit any result
  const { term, score, name, studentId, gradeDistribution } = req.body;
  if ((!term && req.isAdmin) || !name || !studentId) {
    res.status(500).send({
      msg: "Incomplete info",
    });
  } else {
    try {
      Result.findOne({ studentId })
        .then((port) => {
          if (port && port.result.length > 0) {
            getSession()
              .then((sess) => {
                if (isArray(sess) && sess.length > 0) {
                  const resultComponent = new ResultMaker(sess);
                  resultComponent.components(
                    port.result[port.result.length - 1]
                  );
                  resultComponent.changeSubjectScore(
                    req.isAdmin ? term : resultComponent.terms.length,
                    score ? score : undefined,
                    name,
                    gradeDistribution ? gradeDistribution : undefined
                  );
                  port.result[port.result.length - 1] = resultComponent.result;
                  //Mark modified is compulsory to reflect updates
                  port.markModified("result");
                  port.save((err, save) => {
                    if (err) {
                      res.status(500).send({
                        msg: errorMsg,
                      });
                    } else {
                      res.send(save);
                    }
                  });
                } else {
                  res.status(500).send("Something went wrong");
                }
              })
              .catch((err) => res.status(500).send(err));
          } else {
            res.status(500).send({
              msg: "Result doesn't exist",
            });
          }
        })
        .catch((err) =>
          res.status(500).send({
            err,
          })
        );
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

exports.addResultSub = (req, res) => {
  //The end point should have admin analog
  //Attach staffId to a particular termto ensure that only a staff hat uploaded]
  //will be able to update [form teacher too?????]
  //Add subject to the last session in the last term
  const { term, subject, studentId } = req.body;
  getSession()
    .then((sess) => {
      if (isArray(sess) && sess.length > 0) {
        const resultComponent = new ResultMaker(sess);
        if (
          (!term && req.isAdmin) ||
          !studentId ||
          !resultComponent.isObject(subject)
        ) {
          res.status(400).send({
            msg: "Incomplete info",
          });
        } else {
          Result.findOne({ studentId })
            .then((port) => {
              if (port && port.result.length > 0) {
                resultComponent.components(port.result[port.result.length - 1]);
                resultComponent.addSubject(
                  req.isAdmin ? term : resultComponent.terms.length,
                  subject
                );
                port.result[port.result.length - 1] = resultComponent.result;
                port.markModified("result");
                port.save((err, saved) => {
                  if (err) {
                    res.status(500).send(errorMsg + err);
                  } else {
                    res.send(saved);
                  }
                });
              } else {
                res.status(500).send({ msg: errorMsg });
              }
            })
            .catch((err) => res.status(500).send(err));
        }
      } else {
        res.status(500).send("Something went wrong");
      }
    })
    .catch((err) => res.status(500).send(err));
};

exports.removeResultSub = (req, res) => {
  const { term, studentId, name } = req.body;
  if ((!term && req.isAdmin) || !studentId || !name) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    Result.findOne({ studentId })
      .then((port) => {
        if (port && port.result.length > 0) {
          getSession()
            .then((sess) => {
              if (isArray(sess) && sess.length > 0) {
                const resultComponent = new ResultMaker(sess);
                resultComponent.components(port.result[port.result.length - 1]);
                resultComponent.deleteSubject(
                  req.isAdmin ? term : resultComponent.terms.length,
                  resultComponent.terms.length,
                  name
                );
                port.result[port.result.length - 1] = resultComponent.result;
                port.markModified("result");
                port.save((err, saved) => {
                  if (err) {
                    res.status(500).send(errorMsg + err);
                  } else {
                    res.send(saved);
                  }
                });
              } else {
                res.status(500).send("Something went wrong");
              }
            })
            .catch((err) => res.status(500).send(err));
        } else {
          res.status(500).send({ msg: errorMsg });
        }
      })
      .catch((err) => res.status(500).send(err));
  }
};

exports.getTermResult = (req, res) => {
  //Gets Last Result Update later, do for any session
  const { term, studentId } = req.body;
  if (!term || !studentId) {
    res.status(400).send({
      msg: "Incomplete Info",
    });
  } else {
    Result.findOne({ _id: studentId, result: { $ne: [] } })
      .then((port) => {
        if (port) {
          getSession()
            .then((sess) => {
              if (isArray(sess) && sess.length > 0) {
                const resultComponent = new ResultMaker(sess);
                resultComponent.components(port.result[port.result.length - 1]);
                const termResult = resultComponent.getTermSub(term);
                res.send(termResult[2]);
              } else {
                res.status(500).send("Something went wrong");
              }
            })
            .catch((err) => res.status(500).send(err));
        } else {
          res.status(500).send({ msg: errorMsg });
        }
      })
      .catch((err) => res.status(500).send(err));
  }
};
/*
Result to be able to finalize an exam so as to restrict unwanted popping and edits
one after the other
*/
