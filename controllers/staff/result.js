var Student = require("../../models/student");
const Result = require("../../models/result");
const ResultMaker = require("./resultClass");

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
            msg: "Something went wrong",
            err,
          })
        );
    } catch (err) {
      res.status(500).send(...err);
    }
  }
};

exports.getNewResult = (req, res) => {
  Result.find()
    .then((results) => res.send(results))
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};
exports.deleteNewResult = (req, res) => {
  Result.deleteMany()
    .then(() => res.send("All Results deleted"))
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.editResult = (req, res) => {
  const {} = req.body;
  /*
  Term (should be the most recent term)

  //Should term be an object with finalized and num
  //Or should finalized be ahndled by a general perspective?

  update the number in term and insert
  then use formatter to check before saving
  */
};

// deleteResult
//STOPPED AT SANITIZING THE RESULT INPUTS COMPLETELY
//GET THE SUBJECTS IN A TERM

//NEXT, GET THE TERM FOR A SUBJECT WITH AN INDEX
//CHANGE THE MODEL FOR RESULT
