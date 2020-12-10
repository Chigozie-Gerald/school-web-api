var Student = require("../../models/student");
var mongoose = require("mongoose");

exports.postGetResult = function (req, res) {
  const { classResult, session, term, id } = req.body;

  Student.findById(id)
    .then((stud) => {
      if (!stud) {
        res.status(400).send({
          msg: "Couldn't get Student's result",
        });
      } else if (stud) {
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
