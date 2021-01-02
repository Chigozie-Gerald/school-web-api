const jwt = require("jsonwebtoken");
const config = require("../config/key");
const Fee = require("../models/fee");
const TypeSession = require("../models/Types").TypeSession;

const canUpdateFe = (req, res, next) => {
  const { id, deleteFee } = req.body;
  Fee.findOne({ _id: id })
    .then((fee) => {
      if (fee) {
        if (!(!sdeleteFee && fee.student.length > 0)) {
          TypeSession.findOne({ _id: fee.session })
            .then((sess) => {
              if (sess) {
                if (sess.active) {
                  next();
                } else {
                  res.status(500).send({
                    msg:
                      "You can't perform this operation on a fee from an old session",
                  });
                }
              } else {
                res.status(500).send({
                  msg: "Something went wrong, couldn't update fee",
                });
              }
            })
            .catch(() =>
              res.status(500).send({
                msg: "Something went wrong, couldn't update fee",
              })
            );
        } else {
          res.status(500).send({
            msg: "You can't delete a fee one or more students have paid for",
          });
        }
      } else {
        res.status(500).send({
          msg: "Something went wrong, couldn't update fee",
        });
      }
    })
    .catch((err) => res.status(500).send("You can't update this fee"));
};

const auth = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== undefined && bearerHeader !== null) {
    var bearer = bearerHeader.split(" ");
    var token = bearer[1];
    jwt.verify(token, config.jwtSecret, (err, authData) => {
      if (err) {
        res.status(400).json({
          msg: "Invalid Token",
        });
      } else if (authData) {
        req.user = authData;
        next();
      }
    });
  } else {
    res.status(401).send({
      msg: "No Token, Authorization failed",
    });
  }
};

module.exports = { auth, canUpdateFe };
