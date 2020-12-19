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

const getTermSub = (term, resultArr) => {
  if (term <= resultArr[0].terms && term > 0) {
    const top = resultArr[0].terms + 1;
    const Start =
      resultArr.slice(1, term).length > 0
        ? resultArr.slice(1, term).reduce((a, b) => a + b) + top
        : top;
    const Stop = resultArr.slice(1, term + 1).reduce((a, b) => a + b) + top;
    console.log(resultArr.slice(Start, Stop));
  } else {
    console.log("term no dey ");
  }
};

const resultSize = (result) => {
  /*
  The below checks if the size of the array is relatable to the tree 
  (done in the first elem circle) 
  */
  let resultArg = false;

  if (Array.prototype.isPrototypeOf(result) && result.length > 0) {
    if (
      result[0].terms &&
      result.slice(1, result[0].terms + 1).reduce((a, b) => a + b) +
        result[0].terms +
        1 ===
        result.length
    ) {
      resultArg = true;
    } else {
      resultArg = false;
    }
  }
  return resultArg;
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
          port.result.pop();
          res.send(port);
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
  if (!term || !name || !studentId) {
    res.status(500).send({
      msg: "Incomplete info",
    });
  } else {
    try {
      Result.findOne({ studentId })
        .then((port) => {
          if (port) {
            const resultComponent = new ResultMaker();
            console.log(port.result[0]);
            resultComponent.components(port.result[port.result.length - 1]);
            resultComponent.changeSubjectScore(
              term,
              score ? score : undefined,
              name,
              gradeDistribution ? gradeDistribution : undefined
            );
            port.result[port.result.length - 1] = resultComponent.result;
            //Mark modified is compulsory to reflect updates
            port.markModified("result");
            // console.log(port.result);
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
            msg: errorMsg + err,
            err,
          })
        );
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

exports.addResultSub = (req, res) => {
  const { term } = req.body;
};

exports.removeResultSub = (req, res) => {
  const { term } = req.body;
};

exports.getTermResult = (req, res) => {
  //Gets Last Result Update later
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

//Add subject
//Remove Subject
//Get Term Result
//
