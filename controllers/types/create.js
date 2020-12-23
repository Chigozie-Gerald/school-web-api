const Type = require("../../models/Types");
const ResultMaker = require("../staff/resultClass");
const keyCheck = require("../../middleware/section").keyCheck;

exports.createType = (req, res) => {
  const { fee, session, className } = req.body;
  const checker = new ResultMaker().isObject();
  if (
    (fee && !Array.prototype.isPrototypeOf(fee)) ||
    (fee && Array.prototype.isPrototypeOf(fee) && fee.length === 0) ||
    !checker(className) ||
    !checker(session)
  ) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  }

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
          class: [className],
          session: [session],
        });
      }
      newType.save((err, saved) => {
        if (err) {
          res.status(500).send("Something went wrong");
        } else {
          res.send(saved);
        }
      });
    })
    .catch((err) => res.status(500).send("Something went wrong"));
};

exports.deleteTypeFee = (req, res) => {
  const { fee, className } = req.body;
  if (!fee && !className) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  }

  Type.findOne()
    .then((type) => {
      if (type) {
        const feeCheck = fee
          ? type.fees.filter((elem) => elem !== fee)
          : type.fees;
        const classCheck = className
          ? type.class.filter((elem) => elem.name !== className)
          : type.class;
        if (
          (fee && feeCheck.length === type.fees.length) ||
          (className && classCheck.length === type.class.length)
        ) {
          let checkMsg = "Custom Error: ";
          if (fee && feeCheck.length === type.fees.length) {
            checkMsg += "Nothing was deleted from fee type | ";
          }
          if (className && classCheck.length === type.class.length) {
            checkMsg += "Nothing was deleted from Class type";
          }

          res.status(400).send({ msg: checkMsg });
        } else {
          if (fee) {
            type.fees = feeCheck;
            type.markModified("fees");
          }
          if (className) {
            type.class = classCheck;
            type.markModified("class");
          }
          type.save((err, saved) => {
            if (err) {
              res.status(500).send({ msg: "Something went wrong" });
            } else {
              res.send(saved);
            }
          });
        }
      } else {
        res.status(400).send({
          msg: "Type not found, create a type",
        });
      }
    })
    .catch((err) => res.status(500).send("Something went wrong"));
};

exports.addTypeSect = (req, res) => {
  const { session, className, fee } = req.body;

  const sessionCheck =
    new ResultMaker().isObject(session) &&
    keyCheck(session, ["title", "term", "active", "createdAt"]);
  const feeCheck = !!fee;
  const classCheck =
    new ResultMaker().isObject(className) &&
    keyCheck(className, ["name, senior"]);
  if (!sessionCheck && !feeCheck && !classCheck) {
    res.status(400).send({
      msg: "Incomplete/invalid info",
    });
  }
  Type.findOne()
    .then((type) => {
      if (type) {
        const feeFil = feeCheck
          ? type.session.filter((elem) => elem === fee)
          : [];
        const classFil = classCheck
          ? type.session.filter((elem) => elem.name === className.name)
          : [];
        const sessionFil = sessionCheck
          ? type.session.filter((elem) => elem.title === session.title)
          : [];
        if (feeFil.concat(classFil).concat(sessionFil).length > 0) {
          let checkMsg = "Custom Error: ";
          if (feeFil.length > 0) {
            checkMsg += "Fee already exists | ";
          }
          if (classFil.length > 0) {
            checkMsg += "Class already exists | ";
          }
          if (sessionFil.length > 0) {
            checkMsg += "Session already exists";
          }

          res.status(400).send({
            msg: checkMsg,
          });
        } else {
          if (feeCheck) {
            type.session.push(fee);
            type.markModified("fees");
          }
          if (sessionCheck) {
            type.session.push(session);
            type.markModified("session");
          }
          if (classCheck) {
            type.session.push(className);
            type.markModified("class");
          }
          type.save((err, saved) => {
            if (err) {
              res.status(500).send({ msg: "Something went wrong" });
            } else {
              res.send(saved);
            }
          });
        }
      } else {
        res.status(400).send({
          msg: "Type not found, create a type",
        });
      }
    })
    .catch((err) => res.status(500).send("Something went wrong"));
};
