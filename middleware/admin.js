const Staff = require("../models/staff");

exports.editor = function (req, res, next) {
  const { staffId } = req.body;
  Staff.findOne({ _id: staffId, editor: true })
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
};

function admin(req, res, next) {
  const { staffId } = req.body;
  Staff.findOne({ _id: staffId, editor: true })
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
}

module.exports = admin;
