const Period = require("../../models/period");
const { TypeSession } = require("../../models/Types");
const { periodConstruct } = require("./periodClass");

const ObjectCreate = (array) => {
  let newObj = {};

  array.forEach((elem) => {
    const value = Object.keys(elem)[0];
    if (elem[value] !== undefined) {
      newObj[value] = elem[value];
    }
  });
  return Object.keys(newObj).length > 0 ? newObj : false;
};

const Filter = (obj, array) => {
  const valueKeys = Object.keys(obj);

  const newArray = array.filter((elem) => {
    const res = valueKeys.some((el) => elem[el] !== obj[el]);
    if (!res) {
      return elem;
    }
  });

  return newArray;
};

exports.deletePeriod = (req, res) => {
  Period.deleteMany()
    .then(() => res.send("Deleted"))
    .catch(() => res.status(500).send("Something went wrong"));
};

exports.period = (req, res) => {
  Period.find()
    .then((period) => {
      if (period.length > 0) {
        res.send({ msg: period[0] });
      } else {
        res.status(400).send({ msg: "Empty period" });
      }
    })
    .catch((err) => res.status(500).send("Something went wrong" + err));
};
exports.getPeriod = (req, res) => {
  const { session } = req.body;
  Period.findOne({ session })
    .then((period) => {
      if (period) {
        res.send(period);
      } else {
        res.status(400).send({ msg: "Period doesn't exist" });
      }
    })
    .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
};

exports.getPeriodClass = (req, res) => {
  const { session, className, term, subject, arm, day, start, stop } = req.body;
  const body = [
    { className },
    { session },
    { className },
    { term },
    { subject },
    { arm },
    { day },
    { start },
    { stop },
  ];
  Period.findOne({ session })
    .then((period) => {
      if (period) {
        const sessionPeriod = period.period;
        const filterObj = ObjectCreate(body);
        if (filterObj) {
          const result = Filter(filterObj, sessionPeriod);
          res.send(result, "query results");
        } else {
          res.send("Query filter empty");
        }
      } else {
        res.status(400).send({ msg: "Period doesn't exist" });
      }
    })
    .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
};

exports.createPeriod = (req, res) => {
  const { session, start, stop, periodArray } = req.body;
  if (
    !session ||
    !Array.isArray(start) ||
    (Array.isArray(start) && start.length === 0) ||
    !Array.isArray(stop) ||
    (Array.isArray(stop) && stop.length === 0) ||
    !Array.prototype.isPrototypeOf(periodArray)
  ) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    Period.findOne({ session })
      .then((next) => {
        if (next) {
          res.status(400).send({ msg: "Period already exists" });
        } else {
          TypeSession.findOne({ _id: session })
            .then((sess) => {
              if (sess) {
                const term = sess.term;
                try {
                  const period = periodConstruct(periodArray, term);
                  const newPeriod = new Period({
                    term,
                    session,
                    start,
                    stop,
                    period,
                  });
                  newPeriod.save((err, saved) => {
                    if (err) {
                      res.status(500).send(err);
                    } else {
                      res.send(saved);
                    }
                  });
                } catch (err) {
                  res.status(500).send(err);
                }
              } else {
                res.status(400).send({ msg: "Session Provided doesn't exist" });
              }
            })
            .catch((err) =>
              res.status(500).send({ msg: "Something went wrong", err })
            );
        }
      })
      .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
  }
};

//CRUD

/*
Create
  -Entire
  -Add period to term
  -Add term and its subjects
Read
  -Session for a class ***done
  -Session for all Classes ***done
  -Subject for a session for a class ***done
  -Subject for a session for all classes ***done
  -Subject for a term for a class ***done
  -Subject for a term for all classes ***done
Update
  -A subject
  -An array of subjects for active session
Delete
  -A subject from term
*/
