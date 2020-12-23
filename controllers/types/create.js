const Type = require("../../models/Types");
const ResultMaker = require("../staff/resultClass");
const keyCheck = require("../../middleware/section").keyCheck;

//Local constants
const body = ["session", "className", "fee"];

exports.createType = (req, res) => {
  const { fee, session, className } = req.body;
  const checker = new ResultMaker().isObject();
  if (
    (fee && !Array.prototype.isPrototypeOf(fee)) ||
    (fee && Array.prototype.isPrototypeOf(fee) && fee.length === 0) ||
    (currency && !Array.prototype.isPrototypeOf(currency)) ||
    (currency &&
      Array.prototype.isPrototypeOf(currency) &&
      currency.length === 0) ||
    !keyCheck(className, ["name"]) ||
    !keyCheck(session, ["title", "term"])
  ) {
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
            className: [className],
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
  }
};

exports.deleteTypeSect = (req, res) => {
  const { fee, className, currency } = req.body;
  const body = [
    {
      name: fee,
      type: "fee",
      arr: false,
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
    {
      name: className,
      type: "className",
      arr: ["name, senior"],
      check: function () {
        return !!this.name && typeof this.name === "string";
      },
    },
    {
      name: currency,
      type: "currency",
      arr: false,
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
          let errors = [];
          let newArr = [];
          const errorArr = body.some((elem, n) => {
            let innerCheck = false;
            let filterList = false;
            if (elem.arr && elem.name) {
              filterList = type[elem.type].filter((e) => e.title !== elem.name);
              innerCheck = filterList.length === type[elem.type].length;
            } else if (!elem.arr && elem.name) {
              filterList = type[elem.type].filter((e) => e !== elem.name);
              innerCheck = filterList.length === type[elem.type].length;
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
            Remove the consition after testing
             */
            //It can only reach here is 'some' goes through the entire
            //body and didn't find a value equalling the length of the type
            newArr.forEach((elem, n) => {
              if (elem) {
                elem[body[n].type] = elem;
                type.markModified([body[n].type]);
              }
            });

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
  }
};

exports.addTypeSect = (req, res) => {
  const { session, className, currency, fee } = req.body;
  const body = [
    {
      name: session,
      type: "session",
      arr: ["title", "term"],
      check: function () {
        return check(this.name, this.arr);
      },
    },
    {
      name: className,
      type: "className",
      arr: ["name, senior"],
      check: function () {
        return check(this.name, this.arr);
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

  if (!body.some((elem) => elem.check())) {
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
            if (elem.arr) {
              anyError =
                type[elem.type].filter((e) => e.title === elem.name.title)
                  .length > 0;
            } else {
              anyError =
                type[elem.type].filter((e) => e === elem.name).length > 0;
            }
            if (anyError) {
              errors.push(n);
            }
            return anyError;
          });

          if (errorArr) {
            res.status(400).send({
              msg: `Custome Error: ${body[errors[0]].type} already exists`,
            });
          } else {
            body.map((elem) => {
              if (elem.name && elem.check()) {
                type[elem.type].push(elem.name);
                type.markModified(elem.type);
              }
            });
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
  }
};

exports.editTypeSect;
