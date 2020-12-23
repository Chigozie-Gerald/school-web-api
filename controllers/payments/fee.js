const Fee = require("../../models/fee");
const Type = require("../../models/Types");
const Checker = require("../staff/resultClass");

exports.postFee = function (req, res) {
  const {
    name,
    className,
    staffId,
    compulsory,
    online,
    term,
    allClasses,
    subFees,
    currency,
    session,
  } = req.body;

  if (
    !staffId ||
    (!allClasses && !new Checker().isArray(className)) ||
    !new Checker().isArray(!subFees) ||
    !session
  ) {
    res.status(400).send({
      msg: "Please fill in the required fields",
    });
  } else {
    var fee = new Fee({
      name,
      className,
      staffId,
      compulsory,
      online: typeof online !== "boolean" ? online : false,
      allClasses: typeof allClasses === "boolean" ? allClasses : false,
      term: term ? term : 3,
      session,
      currency: currency ? currency : "naira",
      subFees,
    });

    fee.save((err, new_fee) => {
      if (err) {
        res.status(500).send({
          msg: "Something went wrong",
        });
      } else if (new_fee) {
        res.send(new_fee);
      }
    });
  }
};

exports.deleteFee = (req, res) => {
  /*Can only delete for an active session
   */
  const { _id, staffId } = req.body;

  Fee.updateOne(
    {
      _id,
      staffId,
    },
    { isDeleted: true }
  )
    .then((n) => {
      res.send("Operation done (Silent delete)");
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Couldnt not delete Fee, try again later",
      });
      throw err;
    });
};

exports.getFee = (req, res) => {
  /*
  NAME | CLASS | 
   */
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
  Fee.find()
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
  const {
    id,
    staffId,
    name,
    className,
    allClasses,
    compulsory,
    online,
    term,
    session,
    currency,
    subFees,
  } = req.body;

  Fee.findOne({ _id: id, staffId, isDeleted: false })
    .then((fee) => {
      Fee.updateOne(
        { _id: id, staffId },
        {
          name: name ? name : fee.name,
          className: className ? className : fee.className,
          allClasses:
            typeof allClasses === "boolean" ? allClasses : fee.allClasses,
          compulsory:
            typeof allClasses === "boolean" ? compulsory : fee.compulsory,
          online: typeof allClasses === "boolean" ? online : fee.online,
          term: typeof term === "number" ? term : fee.term,
          session: session ? session : fee.session,
          currency: currency ? currency : fee.currency,
          subFees: subFees ? subFees : fee.subFees,
        }
      )
        .then((update) => {
          if (update) {
            res.send(update);
          } else {
            res.status(500).send({
              msg: "Something went wrong",
            });
          }
        })
        .catch((err) =>
          res.status(500).send({ err, msg: "Something went wrong" })
        );
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
      throw err;
    });
};

/*
TERM MANIPULATIONS CAN ONLY BE DONE IN A 
TERM THAT HASN'T STARTED OR A CURRENT TERM
-------------------------------------------
Group Fees/ Aggrregate Fees

Post Fees (**DONE)
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
  Admin get
  Staff get?

Edit Fees
what kind of fees can I update?
ans: the ones no one has paid anything 
i.e when the student array is empty
if someone has paid, an email will be sent telling the person the situation
and to get refund from the school

  Whole Fees
  Details
    Name | Amount (May only be able to update subFees if available) | Sub Fees | term | Session | Others |
    Payment Types | Constraints (eg. Only for SS3)

Delete Fees
  Whole Fees
  Details
    Name | Sub Fees | term | Session | Others |
    Payment Types (master card)


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
