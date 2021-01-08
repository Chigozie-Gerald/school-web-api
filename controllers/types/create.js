const Developer = require("../../models/developer");
const Fee = require("../../models/fee");
const {
  Type,
  TypeSession,
  TypeClassName,
  TypeArm,
  TypeCategory,
  TypeSubject,
} = require("../../models/Types");
const Cert = require("../../models/cert");
const { keyCheck } = require("../../middleware/section");
exports.isObject = (item) =>
  Object.prototype.isPrototypeOf(item) && !Array.prototype.isPrototypeOf(item);
exports.isArray = (item) => Array.prototype.isPrototypeOf(item);
//Local constants
async function send(body, title) {
  await Developer.sendMessage(body, title);
}
const body = ["session", "className", "fee"];

exports.allTypes = async (req, res) => {
  const Types = await Type.find();
  const Arm = await TypeArm.find()
    .then((item) => item)
    .catch((err) => {
      throw new Error(err);
    });
  const Category = await TypeCategory.find()
    .then((item) => item)
    .catch((err) => {
      throw new Error(err);
    });
  const Subject = await TypeSubject.find()
    .then((item) => item)
    .catch((err) => {
      throw new Error(err);
    });
  const ClassName = await TypeClassName.find()
    .then((item) => item)
    .catch((err) => {
      throw new Error(err);
    });
  const Session = await TypeSession.find()
    .then((item) => item)
    .catch((err) => {
      throw new Error(err);
    });
  res.send({
    Types,
    Arm,
    Session,
    ClassName,
    Subject,
    Category,
  });
};

exports.deleteAllTypes = (req, res) => {
  Type.deleteMany()
    .then((type) => {
      const n = type.n;
      res.send({
        msg: `${n} item${n !== 1 ? "s" : ""} ${
          n !== 1 ? "were" : "was"
        } deleted`,
      });
    })
    .catch((err) => res.status(500).send("Something went wrong"));
};

exports.createType = (req, res) => {
  //All should be arrays
  const {
    fee,
    session,
    className,
    currency,
    arm,
    subject,
    category,
  } = req.body;
  const startCheck = [fee, session, className, arm, subject].some(
    (a) => !this.isArray(fee) || a.length === 0
  );
  if (startCheck) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  } else {
    Type.find()
      .then((type) => {
        if (type.length > 0) {
          res.status(400).send({
            msg:
              "Types are only created once and can only be deleted by the developer",
          });
        } else {
          const newType = new Type({
            fee: fee ? fee : ["School Fees"],
            currency: currency ? currency : ["naira"],
            className,
            session,
            arm,
            subject,
            category,
          });
          newType.save((err, saved) => {
            if (err) {
              res.status(500).send("Something went wrong\n" + err);
            } else {
              res.send(saved);
            }
          });
        }
      })
      .catch((err) => res.status(500).send("Something went wrong\n" + err));
  }
};

exports.deleteTypeFee = (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    Fee.findOne({ name })
      .then((fee) => {
        if (fee) {
          res.status(400).send({
            msg: "You can't delete this fee type, it already has a record",
          });
        } else {
          Type.findOne()
            .then((type) => {
              if (type) {
                type.fee = type.fee.filter((e) => e !== name);
                type.save((err, name) => {
                  if (err) {
                    res.status(500).send("Something went wrong");
                  } else {
                    res.send("Fee type deleted successfully");
                  }
                });
              } else {
                send("Type hasn't being created yet", "invalid Type")
                  .then(() => {
                    res.status(500).send("Error: No type has been created");
                  })
                  .catch((err) => res.status(500).send(err));
              }
            })
            .catch((err) =>
              res.status(500).send({
                msg: "Something went wrong",
              })
            );
        }
      })
      .catch((err) =>
        res.status(500).send({
          msg: "Something went wrong",
        })
      );
  }
};
exports.deleteTypeSect = (req, res) => {
  //className, subject are the items you need to delete
  //Can only delete items with own schema
  //Adding last session will implement the current session as last
  //session this delete appears in
  const { className, subject, arm, category } = req.body;
  const body = [
    {
      name: className,
      type: "className",
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
    {
      name: subject,
      type: "subject",
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
    {
      name: arm,
      type: "arm",
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
    {
      name: category,
      type: "category",
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
  ];
  if (!body.some((elem) => elem.check())) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  } else {
    Type.findOne()
      .then((type) => {
        if (type) {
          TypeSession.findOne({ active: true })
            .then((sess) => {
              if (sess) {
                let errors = [];
                let newArr = [];
                const indices = [];
                //This tries to delete an item if the elem.name is in the array
                const errorArr = body.some((elem, n) => {
                  let innerCheck = false;
                  let filterList = false;
                  if (elem.name) {
                    filterList = type[elem.type].filter((e, n) => {
                      if (e.title === elem.name) {
                        indices.push({ [elem.type]: n });
                      }
                      return e.title !== elem.name;
                    });
                    innerCheck = filterList.length === type[elem.type].length;
                  } else {
                    filterList = false;
                  }
                  if (innerCheck) {
                    errors.push(n);
                    newArr.push(false);
                  } else {
                    newArr.push(filterList);
                  }
                  return innerCheck;
                });
                if (errorArr) {
                  res.status(400).send({
                    msg:
                      checkMsg +
                      `Custom Error: Nothing was deleted from ${
                        body[errors[0]].type
                      } class type`,
                  });
                } else if (newArr.length === body.length) {
                  /*
            Remove the condition after testing
             */
                  //It can only reach here is 'some' goes through the entire
                  //body and didn't find a value equalling the length of the type
                  indices.forEach((elem, n) => {
                    if (elem) {
                      //to access the value and key of indices objects
                      const key = Object.keys(elem)[0];
                      type[key][elem[key]].lastSession = sess._id;
                      type.markModified(key);
                    }
                  });

                  type.save((err, saved) => {
                    if (err) {
                      res.status(500).send({ msg: "Something went wrong" });
                    } else {
                      res.send(saved);
                    }
                  });
                } else {
                  console.log("wetin dy sup");
                }
              } else {
                send(
                  "No active session, fix the problem",
                  "Bad Session in Types"
                )
                  .then(() =>
                    res.send({
                      msg: "Somethig went wrong contact your developer",
                    })
                  )
                  .catch((err) =>
                    res.status(500).send({
                      msg: err,
                    })
                  );
              }
            })
            .catch((_) => res.status(500).send("Soemthing went wrong"));
        } else {
          res.status(400).send({
            msg: "Type not found, create a type",
          });
        }
      })
      .catch((err) => res.status(500).send("Something went wrong"));
  }
};

exports.addTypeSect = (req, res) => {
  const {
    session,
    subject,
    arm,
    category,
    className,
    currency,
    fee,
  } = req.body;
  // Session should always be index 0
  const body = [
    {
      name: session,
      type: "session",
      arr: ["title"],
      check: function () {
        return keyCheck(this.name, this.arr);
      },
    },
    {
      name: subject,
      type: "subject",
      arr: ["title"],
      check: function () {
        return keyCheck(this.name, this.arr);
      },
    },
    {
      name: category,
      type: "category",
      arr: ["title"],
      check: function () {
        return keyCheck(this.name, this.arr);
      },
    },
    {
      name: arm,
      type: "arm",
      arr: ["title"],
      check: function () {
        return keyCheck(this.name, this.arr);
      },
    },
    {
      name: className,
      type: "className",
      arr: ["title", "senior"],
      check: function () {
        return keyCheck(this.name, this.arr);
      },
    },
    {
      name: fee,
      type: "fee",
      arr: false,
      check: function () {
        return !!this.name;
      },
    },
    {
      name: currency,
      type: "currency",
      arr: false,
      check: function () {
        return !!this.name;
      },
    },
  ];

  if (body.some((elem) => elem.name && !elem.check())) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  } else {
    Type.findOne()
      .then((type) => {
        if (type) {
          let errors = [];
          const errorArr = body.some((elem, n) => {
            let anyError;
            if (elem.name) {
              if (elem.arr) {
                anyError =
                  type[elem.type].filter((e) => e.title === elem.name.title)
                    .length > 0;
              } else {
                anyError =
                  type[elem.type].filter((e) => e === elem.name).length > 0;
              }
            }

            if (anyError) {
              errors.push(n);
            }
            return anyError;
          });

          if (errorArr) {
            res.status(400).send({
              msg: `Custom Error: ${body[errors[0]].type} already exists`,
            });
          } else {
            if (body[0].check()) {
              if (body[0].type !== "session") {
                res.status(500).send("Please make session the index 0");
              } else {
                TypeSession.findOne({ active: true })
                  .then((typeSes) => {
                    if (typeSes) {
                      Cert.findOne({ session: typeSes._id })
                        .then((cert) => {
                          if (cert) {
                            body.forEach((elem) => {
                              if (elem.name && elem.check()) {
                                type[elem.type].push(elem.name);
                                type.markModified(elem.type);
                              }
                            });
                            type.save((err, saved) => {
                              if (err) {
                                res
                                  .status(500)
                                  .send({ msg: "Something went wrong" });
                              } else {
                                res.send(saved);
                              }
                            });
                          } else {
                            res.status(400).send({
                              msg:
                                "Certify the current session to be able to add a new session",
                            });
                          }
                        })
                        .catch((err) =>
                          res.status(500).send("Something went wrong1" + err)
                        );
                    } else {
                      res
                        .status(500)
                        .send({ msg: "Something went wrong2" + err });
                    }
                  })
                  .catch((err) =>
                    res.status(500).send("Something went wrong3" + err)
                  );
              }
            } else {
              body.forEach((elem) => {
                if (elem.name && elem.check()) {
                  type[elem.type].push(elem.name);
                  type.markModified(elem.type);
                }
              });
              type.save((err, saved) => {
                if (err) {
                  res.status(500).send({ msg: "Something went wrong4" + err });
                } else {
                  res.send(saved);
                }
              });
            }
          }
        } else {
          res.status(400).send({
            msg: "Type not found, create a type",
          });
        }
      })
      .catch((err) => res.status(500).send("Something went wrong5" + err));
  }
};

exports.editTypeSect = (req, res) => {
  /*
  category or className or subject etc should be shaped as:
  {
    id:"56593303jtr0j30i53jm3", //in this doc, maybe title is 'art'
    name:"category",
    all:true,
    senior: true,
    newEdit:"Artism" // 'art' in the title of this doc now changed to 'Artism'
  }
   */
  const { session, category, className, subject, arm } = req.body;
  const body = [session, category, className, subject, arm];
  const check = body.some((el) => {
    if (el && (!el.name || !el.newEdit || !el.id)) {
      return true;
    }
  });
  if (check) {
    res.status(400).send({
      msg: "Bad edit formats check that all newEdit fields are filled",
    });
  } else {
    Type.findOne()
      .then((type) => {
        if (type) {
          body.forEach((elem, n) => {
            if (elem && elem.name) {
              type[elem.name].forEach((b, i) => {
                if (elem.id == b._id) {
                  type[elem.name][i].title = elem.newEdit;
                  if (typeof elem.senior === "boolean") {
                    type[elem.name][i].senior = elem.senior;
                    if (!elem.senior) {
                      type[elem.name][i].all = false;
                    }
                  }
                  if (typeof elem.all === "boolean") {
                    if (elem.all) {
                      type[elem.name][i].senior = true;
                      type[elem.name][i].all = true;
                    } else {
                      type[elem.name][i].all = false;
                    }
                  }
                  type.markModified(elem.name);
                } else {
                  if (elem.name === b) {
                    type[elem.name][i] = elem.newEdit;
                    type.markModified(elem.name);
                  }
                }
              });
            }
          });
          type.save((err, saved) => {
            if (err) {
              res.status(500).send("Something went wrong\n" + err);
            } else {
              res.send({ msg: "Update done where necessary", saved });
            }
          });
        } else {
          send(
            "Type hasn't been created so cannot find any entry",
            "Invalid Type"
          )
            .then(() => {
              res.status(500).send("Something went wrong");
            })
            .catch(err)(res.status(500).send(err));
        }
      })
      .catch((err) => res.status(500).send("Something went wrong"));
  }
};
exports.deleteSession = (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(500).send({ msg: "Incomplete info" });
  } else {
    Type.findOne()
      .then((type) => {
        if (type) {
          const newSession = type.session.filter(
            (elem) => elem._id != sessionId
          );
          // console.log(newSession, "newSession");
          type.session = newSession;
          type.markModified("session");
          type.save((err, saved) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.send(saved);
            }
          });
        } else {
          res.status(400).send({ msg: "Create a Type" });
        }
      })
      .catch((err) => res.status(500).send(err));
  }
};
//(**done**)Can only add a new session if the session preceeding it has been certified
//Edit term in session (can only increase or reduce, not less than 1, not more than 12)
//----Cannot reduce to less than a referenced term
//----Cannot have more than 12 terms
//----Can only edit in an active session
//'refed' = false can be deleted, once referenced, 'refed' = true
//Have routes for activating sessions. Sessions can be deactivated?

//CREATE CERFITIED MODEL
//Certififying a session means closing it and creating a new Session
//Certifying involves checking if it is refed, it may have a backdoor and closing
//Closing means passing that session as the current certified
//value in cert model

//Checking if refed is checking for a fee with someone who has
//paid and checking for a result
//EDIT TERM IN ACTIVE SESSION
//a term is refered just as a session
//a term isn't cetified

/*
***Session rules
-You cannot perform any operation on an inactive session
a session is inactive if active is false in schema or/and if the value of createdAt in
the populated session is less than or equal to the session in question
-Silent active sessions are open briefly if a result is to be added
(This means that to add or delete a result, the session has to be
active or silentActive, The actions involves CRUD)

***Subject, ClassName, Arm, Subject, Category rules
-A subject can only be gotten if it's lastSession value is undefined or is less that
the value of the createdAt of the populated value of the lastSession
-If a session has been initially inactivated, it cannot be activated anymore, but it can be 
silentActivated
-It may only be activated fully if the session after it is deleted
--If the session after it is refed, it cannot be deleted

***Fees rules
-When a fee is softDeleted, it cannot be gotten 

*/
