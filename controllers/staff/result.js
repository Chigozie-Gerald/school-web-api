var Student = require("../../models/student");
const Result = require("../../models/result");
const ResultMaker = require("./resultClass");
const result = require("../../models/result");

const errorMsg = "Something went wrong";

exports.postGetResult = function (req, res) {
  const { classResult, session, term, id } = req.body;

  Student.findById(id)
    .then((stud) => {
      if (!stud) {
        res.status(400).send({
          msg: "Couldn't get Student's result",
        });
      } else if (stud) {
        // stud.classResult.map((elem, n)=>{
        //   elem
        // })
        if (stud.classResult.length > 0) {
          let i = 0;
          while (i < stud.classResult.length) {
            let obj = stud.classResult[i]["name"];
            if (obj === classResult) {
              let a = 0;
              while (a < stud.classResult[i].session.length) {
                let obj1 = stud.classResult[i].session[a]["name"];
                if (obj1 === session) {
                  let b = 0;
                  while (b < stud.classResult[i].session[a].term.length) {
                    let obj2 = stud.classResult[i].session[a].term[b]["name"];
                    if (obj2 === term) {
                      res.send(stud.classResult[i].session[a].term[b]);
                      break;
                    } else {
                      b++;
                      if (b === stud.classResult[i].session[a].term.length) {
                        res.status(400).send({
                          msg: "Invalid Term",
                        });
                        break;
                      }
                    }
                  }
                  break;
                } else {
                  a++;
                  if (a === stud.classResult[i].session.length) {
                    res.status(400).send({
                      msg: "That session does not exist",
                    });
                    break;
                  }
                }
              }
              break;
            } else {
              i++;
              if (i === stud.classResult.length) {
                res.status(400).send({
                  msg: "That class does not exist...",
                });
                break;
              }
            }
          }
        } else
          res.status(400).send({
            msg: "No results found",
          });
      }
    })
    .catch((err) => {
      res.status(400).send({
        msg: "Couldn't find Student",
      });
    });
};

exports.postResult = function (req, res) {
  const {
    classResult,
    session,
    term,
    subject,
    test1,
    test2,
    examination,
    id,
  } = req.body;

  Student.findById(id)
    .then((stud) => {
      if (stud) {
        if (!stud.classResult || stud.classResult.length === 0) {
          var result = {
            name: classResult,
            session: {
              name: session,
              term: {
                name: term,
                subject: { name: subject, test1, test2, examination },
              },
            },
          };
          stud.classResult.push(result);
          console.log(stud.firstname, "initially had empty results");
          stud.save();
          res.json(stud);
        } else if (stud.classResult.length > 0) {
          var i = 0;
          while (i < stud.classResult.length) {
            var obj = stud.classResult[i]["name"];
            if (obj === classResult) {
              let a = 0;
              while (a < stud.classResult[i].session.length) {
                var obj1 = stud.classResult[i].session[a]["name"];
                if (obj1 === session) {
                  let b = 0;
                  while (b < stud.classResult[i].session[a].term.length) {
                    var obj2 = stud.classResult[i].session[a].term[b]["name"];
                    if (obj2 === term) {
                      let c = 0;
                      while (
                        c <
                        stud.classResult[i].session[a].term[b].subject.length
                      ) {
                        let obj3 =
                          stud.classResult[i].session[a].term[b].subject[c][
                            "name"
                          ];
                        if (obj3 === subject) {
                          var R_details = {
                            name: subject,
                            test1,
                            test2,
                            examination,
                          };
                          stud.classResult[i].session[a].term[b].subject[
                            c
                          ] = R_details;
                          stud.save();
                          res.send(stud);
                          console.log(
                            stud.firstname,
                            "nothing changed, new details"
                          );
                          break;
                        }
                        c++;
                        if (
                          c ===
                          stud.classResult[i].session[a].term[b].subject.length
                        ) {
                          stud.classResult[i].session[a].term[
                            b
                          ].subject.unshift({
                            name: subject,
                            test1,
                            test2,
                            examination,
                          });
                          stud.save();
                          res.json(stud);
                          console.log(stud.firstname, "subject unshifted");
                          break;
                        }
                      }
                      break;
                    } else {
                      b++;
                      if (b === stud.classResult[i].session[a].term.length) {
                        stud.classResult[i].session[a].term.unshift({
                          name: term,
                          subject: {
                            name: subject,
                            test1,
                            test2,
                            examination,
                          },
                        });
                        stud.save();
                        res.json(stud);
                        console.log(stud.firstname, "term unshifted");
                        break;
                      }
                    }
                  }
                  break;
                } else {
                  a++;
                  if (a === stud.classResult[i].session.length) {
                    stud.classResult[i].session.unshift({
                      name: session,
                      term: {
                        name: term,
                        subject: {
                          name: subject,
                          test1,
                          test2,
                          examination,
                        },
                      },
                    });
                    stud.save();
                    res.json(stud);
                    console.log(stud.firstname, "session unshifted");
                    break;
                  }
                }
              }
              break;
            } else {
              i++;
              if (i === stud.classResult.length) {
                stud.classResult.unshift({
                  name: classResult,
                  session: {
                    name: session,
                    term: {
                      name: term,
                      subject: { name: subject, test1, test2, examination },
                    },
                  },
                });
                console.log(stud.firstname, "classResult unshifted");
                stud.save();
                res.json(stud);
                break;
              }
            }
          }
        }
      } else
        res.status(400).send({
          msg: "Student does not exist",
        });
    })
    .catch((err) => {
      res.status(400).send({ msg: errorMsg });
      throw err;
    });
};

exports.getAllNewResult = (req, res) => {
  Result.find()
    .then((results) => res.send(results))
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
      const new_result = new ResultMaker().components(result);
      const resultCreate = new_result.result;
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
    } catch (err) {
      res.status(500).send(err);
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
            const resultComponent = new ResultMaker();
            resultComponent.components(port.result[port.result.length - 1]);
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
  const resultComponent = new ResultMaker();
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
          const resultComponent = new ResultMaker();
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
          const resultComponent = new ResultMaker();
          resultComponent.components(port.result[port.result.length - 1]);
          const termResult = resultComponent.getTermSub(term);
          res.send(termResult[2]);
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
