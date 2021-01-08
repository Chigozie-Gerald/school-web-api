const { session } = require("passport");
const {
  SubjectPeriod,
  TermPeriod,
  SessionPeriod,
} = require("../../models/period");
const Period = require("../../models/period1");
const { TypeSession } = require("../../models/Types");
const { periodConstruct } = require("./periodClass");

const subVal = (subject) =>
  new Promise((resolve, reject) => {
    const len = subject.length;
    let count = 0;
    validate = (elem) => {
      let element = elem[count];
      let initElement = elem[count - 1];
      subject[count].kind = "SubjectPeriodScheme";
      new SubjectPeriod(elem[count])
        .validate()
        .then(() => {
          count++;
          if (
            (count > 1 && element.start !== initElement.stop) ||
            element.start >= element.stop
          ) {
            reject({ msg: "Inconsistent timing in subjects" });
          }
          if (count === len) {
            resolve(true);
          } else {
            validate(subject);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    };
    validate(subject);
  });
const termVal = (terms, session) =>
  new Promise((resolve, reject) => {
    const len = terms.length;
    let count = 0;
    if (len !== session[0].terms) {
      reject("Inconsistencies in term");
    }
    validate = (elem) => {
      terms[count].kind = "TermPeriodScheme";
      new TermPeriod(elem[count])
        .validate()
        .then(() => {
          count++;
          if (count === len) {
            resolve(true);
          } else {
            validate(terms);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    };
    validate(terms);
  });
const sessVal = (sess) =>
  new Promise((resolve, reject) => {
    const len = sess.length;
    let count = 0;
    validate = (elem) => {
      sess[count].kind = "SessionPeriodScheme";
      new SessionPeriod(elem[count])
        .validate()
        .then(() => {
          count++;
          if (count === len) {
            resolve(true);
          } else {
            validate(sess);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    };
    validate(sess);
  });
// exports.createPeriod = (req, res) => {
//   //install async later on
//   const { session, terms, subjects } = req.body;
//   if (!session || !terms || !subjects) {
//     res.status(400).send({ msg: "Incomplete info" });
//   } else {
//     try {
//       sessVal(session)
//         .then(() => {
//           termVal(terms, session)
//             .then(() => {
//               subVal(subjects)
//                 .then(() => {
//                   Period.findOneAndUpdate(
//                     { studentId },
//                     {
//                       $push: { result: resultCreate },
//                       $set: { _id: studentId },
//                     },
//                     { new: true, upsert: true, useFindAndModify: false }
//                   )
//                   .then(period=>{

//                   })
//                   .catch(err=>res.status(500).send(err))

//                   const period = new Period({
//                     className: "5fee2025cd67ac14dc5c38d0",
//                     period: [session.concat(terms).concat(subjects)],
//                   });
//                   period.save((err, saved) => {
//                     if (err) {
//                       res.status(500).send(err);
//                     } else {
//                       res.send(saved);
//                     }
//                   });
//                 })
//                 .catch((err) => res.status(500).send(err));
//             })
//             .catch((err) => res.status(500).send(err));
//         })
//         .catch((err) => res.status(500).send(err));
//     } catch (err) {
//       res.status(500).send({ err });
//     }
//   }
// };
exports.deletePeriod = (req, res) => {
  Period.deleteMany()
    .then(() => res.send("Deleted"))
    .catch(() => res.status(500).send("Something went wrong"));
};
exports.getPeriod = (req, res) => {
  Period.find()
    .then((period) => {
      if (period.length > 0) {
        res.send(period);
      } else {
        res.status(400).send({ msg: "Empty period" });
      }
    })
    .catch((err) => res.status(500).send("Something went wrong" + err));
};

exports.createPeriod = (req, res) => {
  const { session, periodArray } = req.body;
  if (!session || !Array.prototype.isPrototypeOf(periodArray)) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
    TypeSession.findOne({ _id: session })
      .then((sess) => {
        if (sess) {
          const term = sess.term;
          try {
            const period = periodConstruct(periodArray, term);

            Period.findOneAndUpdate(
              { session },
              {
                $set: { term, session, period },
              },
              { new: true, upsert: true, useFindAndModify: false }
            )
              .then((per) => res.send(per))
              .catch((err) => res.status(500).send(err));

            // const newPeriod = new Period({
            //   session,
            //   term: term,
            //   period,
            // });
            // newPeriod.save((err, saved) => {
            //   if (err) {
            //     res.status(500).send(err);
            //   } else {
            //     res.send(saved);
            //   }
            // });
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
};
