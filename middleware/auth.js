const jwt = require("jsonwebtoken");
const config = require("../config/key");

function auth(req, res, next) {
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
}

module.exports = auth;
