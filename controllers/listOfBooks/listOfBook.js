var ListOfBook = require("../../models/listOfBook");
var mongoose = require("mongoose");

exports.postListOfBook = function (req, res) {
  const {
    className,
    category,
    publisher,
    bookName,
    volume,
    session,
    subject,
    edition,
    authors,
  } = req.body;

  if (
    !className ||
    !publisher ||
    !bookName ||
    !session ||
    !subject ||
    !edition ||
    !authors
  ) {
    res.status(400).send({
      msg: "Please fill in the required field(s)",
    });
  } else {
    var listOfBook = new ListOfBook({
      className,
      category,
      publisher,
      bookName,
      subject,
      volume,
      session,
      edition,
      authors,
    });

    listOfBook.save((err, list) => {
      if (err) {
        res.status(500).send({
          msg:
            "Something went wrong while trying to update the list of Books. \n  Check your connection and try again",
        });
      } else if (list) {
        res.send(list);
      }
    });
  }
};

exports.listOfBook = function (req, res) {
  ListOfBook.find({})
    .sort({ createdAt: -1 })
    .then((lists) => {
      if (lists.length > 0) {
        res.send(lists);
      } else {
        res.status(400).send({
          msg: "No List of Books Collection yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
      throw err;
    });
};

exports.getListOfBook = function (req, res) {
  const { className, category } = req.body;
  ListOfBook.find({ className, category })
    .sort({ createdAt: -1 })
    .then((lists) => {
      if (lists.length > 0) {
        res.send(lists);
      } else {
        res.status(400).send({
          msg: "No List of Books Collection yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
    });
};

exports.deleteListOfBook = function (req, res) {
  const { _id } = req.body;

  ListOfBook.deleteOne({
    _id,
  })
    .then((removed) => {
      ListOfBook.find({})
        .sort({ createdAt: -1 })
        .then((list) => {
          if (list.length > 0) {
            res.send(list);
          } else {
            res.status(400).send({
              msg: "No List of Books Collection yet",
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
};

exports.updateListOfBook = function (req, res) {
  const {
    _id,
    className,
    category,
    publisher,
    bookName,
    subject,
    volume,
    session,
    edition,
    authors,
  } = req.body;
  if (
    !_id ||
    !className ||
    !publisher ||
    !bookName ||
    !session ||
    !edition ||
    !subject ||
    !authors
  ) {
    res.status(400).send({
      msg: "Please fill in the required field(s)",
    });
  } else {
    ListOfBook.updateOne(
      { _id },
      {
        className,
        authors,
        edition,
        session,
        volume,
        bookName,
        publisher,
        category,
        subject,
      }
    )
      .then((listUpdate) => {
        ListOfBook.find({ _id })
          .then((list) => {
            if (list.length > 0) {
              res.send(list);
            } else {
              res.status(400).send({
                msg: "No List Collection yet",
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
