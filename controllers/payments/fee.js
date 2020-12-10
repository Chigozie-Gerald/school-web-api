var Fee = require("../../models/fee");
var mongoose = require("mongoose");

exports.postFee = function (req, res) {
  const { className, category, feesTitle, sub, currency, session } = req.body;

  if (!className || !feesTitle || !sub || !session || !currency) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    var total = 0;
    for (let i = 0; i < sub.length; i++) {
      let amt = sub[i]["subAmount"];
      let amount = parseFloat(amt, 10);
      total += amount;
    }

    var fee = new Fee({
      className,
      category,
      currency,
      feesTitle,
      session,
      subFees: sub,
      total,
    });

    fee.save((err, new_fee) => {
      if (err) {
        res.status(500).send({
          msg: "Something went wrong",
        });
        // throw err;
      } else if (new_fee) {
        res.send(new_fee);
      }
    });
  }
};

exports.deleteFee = function (req, res) {
  const { _id } = req.body;

  Fee.deleteOne({
    _id,
  })
    .then((f) => {
      Fee.find()
        .sort({ createdAt: -1 })
        .then((e_fee) => {
          if (e_fee.length > 0) {
            res.send(e_fee);
          } else {
            res.status(400).send({
              msg: "No Fees yet",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            msg: "Something went wrong",
          });
          throw err;
        });
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Couldnt not delete Fee, try again later",
      });
      throw err;
    });
};

exports.getFee = function (req, res) {
  const { className, category, session } = req.body;

  if (!className || !session) {
    res.status(400).send({
      msg: "Please fill in required fields",
    });
  } else {
    Fee.find({
      className,
      session,
      category,
    })
      .sort({ createdAt: -1 })
      .then((list) => {
        if (list.length > 0) {
          res.send(list);
        } else {
          res.status(400).send({
            msg: "No Fees yet",
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

exports.fee = function (req, res) {
  Fee.find({})
    .sort({ className: 1 })
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
  const { _id, sub } = req.body;

  if (!_id || !sub) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    let total = 0;
    for (let i = 0; i < sub.length; i++) {
      let amt = sub[i]["subAmount"];
      let amount = parseFloat(amt);
      total = total + amount;
    }
    Fee.updateOne({ _id }, { total, subFess: sub })
      .then((f) => {
        Fee.find({ _id })
          .then((fee) => {
            if (fee) {
              res.send(fee);
            } else {
              res.status(500).send({
                msg: "Something went wrong",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              msg: "Something went wrong",
            });
            throw err;
          });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Something went wrong",
        });
        throw err;
      });
  }
};
