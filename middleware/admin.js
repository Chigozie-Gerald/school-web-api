const Staff = require("../models/staff");
const jwt = require("jsonwebtoken");
const config = require("../config/key");
const auth = require("./auth");

const authContinue = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== undefined && bearerHeader !== null) {
    var bearer = bearerHeader.split(" ");
    var token = bearer[1];

    jwt.verify(token, config.jwtSecret, (err, authData) => {
      if (err) {
        throw {
          msg: "Invalid Token",
        };
      } else if (authData) {
        return authData;
      }
    });
  } else {
    throw {
      msg: "No Token, Authorization failed",
    };
  }
};

const editor = (req, res, next) => {
  try {
    const userData = authContinue(req);
    Staff.findOne({ _id: userData.user, editor: true })
      .then((staff) => {
        if (staff) {
          req.isEditor = true;
          next();
        } else {
          req.isEditor = false;
          res.status(401).send({
            msg: "You can't proceed",
          });
        }
      })
      .catch(() => {
        req.isEditor = false;
        res.status(500).send({
          msg: "You can't proceed",
        });
      });
  } catch (err) {
    res.status(400).send(err);
  }
};

const admin = (req, res, next) => {
  try {
    const userData = authContinue(req);
    Staff.findOne({ _id: userData.user, admin: true })
      .then((staff) => {
        if (staff) {
          req.isAdmin = true;
          next();
        } else {
          req.isAdmin = false;
          res.status(401).send({
            msg: "You can't proceed",
          });
        }
      })
      .catch(() => {
        req.isAdmin = false;
        res.status(500).send({
          msg: "You can't proceed",
        });
      });
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports = { admin, editor };
