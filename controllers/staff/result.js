var Student = require("../../models/student");
var mongoose = require("mongoose");
const Result = require("../../models/result");

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
      res.status(400).send({ msg: "Something went wrong" });
      throw err;
    });
};

const resultSize = (result) => {
  /*
  The below checks if the size of the array is relatable to the tree 
  (done in the first elem circle) 
  */
  let resultArg = false;
  if (Array.prototype.isPrototypeOf(result) && result.length) {
    if (
      result[0].terms &&
      result.splice(1, result[0].term).reduce((a, b) => a + b) +
        result[0].term +
        1 ===
        result.length
    ) {
      resultArg = true;
    } else {
      resultArg = false;
    }
  } else {
    return resultArg;
  }
};

const ResultFormatter = (result) => {
  /*
  Ensure sanitized result is passed (i.e an actual array with size greater than zero)
  */
  let keepMap = true;
  const errorArr = [];
  result.map((elem, n) => {
    if (!keepMap) {
      if (n === 0 && !Object.prototype.isPrototypeOf(elem)) {
        keepMap = false;
        errorArr.push("Fatal: Incorrect header type");
      } else {
        if (n === 0) {
          /*
        The below ensures the integrity of the header object
        */
          if (
            !Object.keys(elem).includes("terms") ||
            !Object.keys(elem).includes("session") ||
            !Object.keys(elem).includes("class") ||
            (Object.keys(elem).includes("excluded") && elem.terms === 3) ||
            (!Object.keys(elem).includes("excluded") && elem.terms !== 3)
          ) {
            keepMap = false;
            errorArr.push("Bad Header keys");
          }
          //Below checks size
          if (!resultSize(result) && keepMap) {
            keepMap = false;
            errorArr.push("Inconsistent size");
          }
        }
        //Datatype check
        if (n <= result[0].terms && n > 0) {
          if (typeof elem !== "number") {
            keepMap = false;
            errorArr.push("Term datatype is bad");
          }
        }
        if (n > result[0].terms) {
          if (!Object.prototype.isPrototypeOf(elem)) {
            keepMap = false;
            errorArr.push("Subject datatype is bad");
          } else {
            // Check integrity of subject type
            if (
              !Object.keys(elem).includes("term") ||
              !Object.keys(elem).includes("name") ||
              !Object.keys(elem).includes("gradeDistribution") ||
              !Object.keys(elem).includes("score") ||
              !Object.keys(elem).includes("class")
            ) {
              keepMap = false;
              errorArr.push("Subject Integrity is bad");
            } else {
              /*
              Grade distribution and score are meant to have the same length 
              of array
              also, the grade distribution items are meant to resuce to 100
              */
              if (
                !Array.prototype.isPrototypeOf(elem.gradeDistribution) ||
                !Array.prototype.isPrototypeOf(elem.score)
              ) {
                keepMap = false;
                errorArr.push(
                  "Grade Distribution/score is meant to be an array"
                );
              } else {
                // typeof here ensures numbers are given integrity check
                if (
                  elem.gradeDistribution.reduce((a, b) =>
                    typeof b === "number" ? a + b : a + 0
                  ) !== 100 ||
                  elem.score.reduce((a, b) =>
                    typeof b === "number" ? a + b : a + -10000
                  ) > 100 ||
                  elem.score.reduce((a, b) =>
                    typeof b === "number" ? a + b : a + -10000
                  ) < 0 ||
                  elem.gradeDistribution.length !== elem.score.length
                ) {
                  keepMap = false;
                  errorArr.push("Grade Distribution/score inconsistencies");
                }
              }
            }
          }
        }
      }
    }
  });
  return keepMap;
};

exports.newResult = (req, res) => {
  const { studentId, result } = req.body;
  if (!studentId || !Array.prototype.isPrototypeOf(result) || !result.length) {
    res.status(500).send({ msg: "Incomplete info" });
  } else {
    /* Head contains (object)
          the number of TERMS
          the SESSION name
          the CLASS of student
          EXCLUDED TERM (if term is not 3)

      Terms contains (number)
          the number of SUBJECT

      Subject contains (object)
          TERM parent
          the NAME of subject
          GRADING type
          GRADING distribution (array)
          TEST score
          EXAM score (will be called test2)
    */

    //Checker
    console.log(ResultFormatter(result));

    if (result[0]) {
    } else {
      Result.findOne({ studentId })
        .then(() => {
          const newResult = new Result({
            studentId,
            result,
          });
        })
        .catch(() => res.status(500).send({ msg: "Something went wrong" }));
    }
  }
};
