const Fee = require("../../models/fee");
const TypeClassName = require("../../models/Types").TypeClassName;
const TypeSession = require("../../models/Types").TypeSession;
const Type = require("../../models/Types").Type;
const Checker = require("../staff/resultClass");

exports.postFee = function (req, res) {
  const {
    name,
    className,
    staffId,
    compulsory,
    isCategorized,
    category,
    online,
    term,
    allClasses,
    subFees,
    currency,
    session,
  } = req.body;

  if (
    !staffId ||
    (!allClasses && !new Checker().isArray(className)) ||
    (isCategorized && !category) ||
    !new Checker().isArray(!subFees) ||
    !session
  ) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    Fee.findOne({
      session,
      name,
    })
      .then((fee) => {
        if (fee) {
          res.status(400).send({ msg: "Fee already exists" });
        } else {
          var fee = new Fee({
            name,
            className,
            staffId,
            compulsory,
            isCategorized,
            category,
            online: typeof online !== "boolean" ? online : false,
            allClasses: typeof allClasses === "boolean" ? allClasses : false,
            term: term ? term : 3,
            session,
            currency: currency ? currency : "naira",
            subFees,
          });

          fee.save((err, new_fee) => {
            if (err) {
              res.status(500).send({
                msg: "Something went wrong",
              });
            } else if (new_fee) {
              res.send(new_fee);
            }
          });
        }
      })
      .catch(() => res.status(500).send({ msg: "Something went wrong" }));
  }
};

exports.deleteFee = (req, res) => {
  /*Can only delete for an active session
   */
  const { _id, staffId, deleteFee } = req.body;
  //deleteFee should be a boolean to be accessed in canUpdateFee middleware
  Fee.updateOne(
    {
      _id,
      staffId,
    },
    { isDeleted: true }
  )
    .then((n) => {
      res.send("Operation done (Silent delete)");
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Couldnt not delete Fee, try again later",
      });
      throw err;
    });
};

exports.getStudentFee = (req, res) => {
  //How do I get the active term
  /*
  NAME | CLASS | 
   */
  const { className, StartSessionId, studentId, term } = req.body;

  if (!className || !StartSessionId || !studentId || !term) {
    res.status(400).send({
      msg: "Please fill in required fields",
    });
  } else {
    Fee.find({
      className,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .then((fee) => {
        if (fee.length > 0) {
          TypeSession.findOne({ _id: StartSessionId })
            .then((session) => {
              if (session) {
                const feeResult = fee.filter(
                  (e) => e.createdAt >= session.createdAt
                );
                res.send(feeResult);
              } else {
                res
                  .status(500)
                  .send({ msg: "Session you provided doesn't exist" });
              }
            })
            .catch(() =>
              res.status(500).send({
                msg: "Something went wrong",
              })
            );
        } else {
          res.status(500).send({
            msg: "Fee not found",
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

exports.getStaffFee = (req, res) => {
  const { StartSessionId, staffId, term } = req.body;

  if (!StartSessionId || !staffId || !term) {
    res.status(400).send({
      msg: "Please fill in required fields",
    });
  } else {
    Fee.find({
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .then((fee) => {
        if (fee.length > 0) {
          TypeSession.findOne({ _id: StartSessionId })
            .then((session) => {
              if (session) {
                const feeResult = fee.filter(
                  (e) => e.createdAt >= session.createdAt
                );
                res.send(feeResult);
              } else {
                res
                  .status(500)
                  .send({ msg: "Session you provided doesn't exist" });
              }
            })
            .catch(() =>
              res.status(500).send({
                msg: "Something went wrong",
              })
            );
        } else {
          res.status(500).send({
            msg: "Fee not found",
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

exports.getAdminFee = function (req, res) {
  Fee.find()
    .sort({ createdAt: 1 })
    .then((fee) => {
      res.send(fee);
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
      throw err;
    });
};

exports.updateFee = function (req, res) {
  const {
    id,
    staffId,
    name,
    className,
    allClasses,
    compulsory,
    isCategorized,
    category,
    online,
    term,
    session,
    currency,
    subFees,
  } = req.body;

  Fee.updateOne(
    { _id: id, staffId, isDeleted: false },
    {
      name,
      className,
      allClasses,
      compulsory,
      online,
      isCategorized,
      category,
      term,
      session,
      currency,
      subFees,
    },
    { omitUndefined: true }
  )
    .then((update) => {
      if (update) {
        res.send(update);
      } else {
        res.status(500).send({
          msg: "Something went wrong",
        });
      }
    })
    .catch((err) => res.status(500).send({ err, msg: "Something went wrong" }));
};

exports.updateSubFees = (req, res) => {
  const { id, subFee } = req.body;

  if (!id || !subFees) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    Fee.findBOne({ _id: id, isDeleted: false })
      .then((fee) => {
        if (fee) {
          let found = false;
          fee.subFees.map((elem, n) => {
            if (elem.subName === subFee.subName) {
              found = n;
            }
          });
          if (typeof found === "number") {
            fee.subFees[found] = subFee;
            fee.save((err, saved) => {
              if (err) {
                res.status(500).send({
                  msg: "Something went wrong",
                });
              } else {
                res.send(saved);
              }
            });
          } else {
            res.status(400).send({
              msg: "Sub Fee not found",
            });
          }
        } else {
          res.status(400).send({ msg: "Fee no found" });
        }
      })
      .catch((err) =>
        res.status(500).send({ err, msg: "Something went wrong" })
      );
  }
};
exports.addSubFees = (req, res) => {
  const { subFee, id } = req.body;

  if (!id || !subFees) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    Fee.findOne({ _id: id, isDeleted: false })
      .then((fee) => {
        if (fee) {
          let found = false;
          fee.subFees.map((elem, n) => {
            if (elem.subName === subFee.subName) {
              found = true;
            }
          });
          if (!found) {
            fee.subFees.push(subFee);
            fee.save((err, saved) => {
              if (err) {
                res.status(500).send({
                  msg: "Something went wrong",
                });
              } else {
                res.send(saved);
              }
            });
          } else {
            res.status(400).send({
              msg: "Sub Fee already exists",
            });
          }
        } else {
          res.status(400).send({ msg: "Fee no found" });
        }
      })
      .catch((err) =>
        res.status(500).send({ err, msg: "Something went wrong" })
      );
  }
};

exports.deleteSubFees = (req, res) => {
  const { subFee, id } = req.body;

  if (!id || !subFees) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    Fee.findOne({ _id: id, isDeleted: false })
      .then((fee) => {
        if (fee) {
          let found = false;
          fee.subFees.map((elem, n) => {
            if (elem.subName === subFee.subName) {
              found = n;
            }
          });
          if (typeof found === "number") {
            fee.subFees.splice(found, 1);
            fee.save((err, saved) => {
              if (err) {
                res.status(500).send({
                  msg: "Something went wrong",
                });
              } else {
                res.send({ msg: "Item deleted", saved });
              }
            });
          } else {
            res.status(400).send({
              msg: "Sub Fee already exists",
            });
          }
        } else {
          res.status(400).send({ msg: "Fee no found" });
        }
      })
      .catch((err) =>
        res.status(500).send({ err, msg: "Something went wrong" })
      );
  }
};
/*
TERM MANIPULATIONS CAN ONLY BE DONE IN A 
TERM THAT HASN'T STARTED OR A CURRENT TERM
-------------------------------------------
Group Fees/ Aggrregate Fees

Post Fees (**DONE)
  School Fees
  PTA
  Uniform
  Destruction
  Extra Lessons
  Bus
  Books
  Extras (Excursion)
  Boarding House Fees
  Miscellaneous like (NECO, WAEC, BECE etc...)


Get Fees as a student, as a staff, as an admin (**DONE)
  For a term
  For a session
  For a length of time
  For everytime
  Admin get
  Staff get?

Edit Fees
what kind of fees can I update?
ans: the ones no one has paid anything 
i.e when the student array is empty
if someone has paid, an email will be sent telling the person the situation
and to get refund from the school

  Whole Fees
  Details
    Name | Amount (May only be able to update subFees if available) | Sub Fees | term | Session | Others |
    Payment Types | Constraints (eg. Only for SS3)

Delete Fees
  Whole Fees
  Details
    Name | Sub Fees | term | Session | Others |
    Payment Types (master card)


History

Get History
Admin Get
Student Get

STUDENTS WITH PENDING FEES
Aggregate based on (Give details of transfered out or graduated)
  Class
  Arm
  Whole School
  Pending Fee
  Students that are free
  Destruction of school properties
  Other miscellaneous fees like (WAEC, BECE, NECO etc...)

*/

/*
  Uploader id
  Check if admin
  Name
  Details
  Constraints
  Term
  session
  All / (all terms)
  Check if a fee exists for that type in the term/session before creating
  A Fee enters a document and a session field is filled
  In types, the fees value is modified, i.e, the particular name object 
  recieves the new
  ObjectId as an  unshift

  **Likewise delete
  */
