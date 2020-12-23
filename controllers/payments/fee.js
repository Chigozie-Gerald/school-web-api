const Fee = require("../../models/fee");
const Type = require("../../models/Types");

exports.postFee = function (req, res) {
  const { className, category, feesTitle, sub, currency, session } = req.body;

  if (!className || !feesTitle || !sub || !session || !currency) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
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

exports.deleteFee = (req, res) => {
  const { _id, adminId } = req.body;

  Fee.deleteOne({
    _id,
    adminId,
  })
    .then((n) => {
      console.log(n);
      res.send("Operation done");
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Couldnt not delete Fee, try again later",
      });
      throw err;
    });
};

exports.getFee = (req, res) => {
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

/*
TERM MANIPULATIONS CAN ONLY BE DONE IN A 
TERM THAT HASN'T STARTED OR A CURRENT TERM
-------------------------------------------
Group Fees/ Aggrregate Fees

Post Fees
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


Get Fees
  For a term
  For a session
  For a length of time
  For everytime

Edit Fees
  Whole Fees
  Details
    Name | Amount (May only be able to update subFees if available) | Division of payment | term | Session | Others |
    Payment Types | Constraints (eg. Only for SS3)

Delete Fees
  Whole Fees
  Details
    Name | Amount | Division of payment | term | Session | Others |
    Payment Types


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

exports.createFee = () => {
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
  const {} = req.body;

  Fee.findOneAndDelete(
    { _id: id },
    {
      $push: {},
      $set: {},
    }
  );
  Fee.create({}).then().then();
};

exports.delete;
