const { keyCheck } = require("../../middleware/section");
const { TypeSession } = require("../../models/Types");
const { Book, ListOfBook } = require("../../models/listOfBook");
exports.postListOfBook = function (req, res) {
  const { className, uploaderId, category, books } = req.body;

  if (
    !className ||
    !uploaderId ||
    books.length === 0 ||
    Array.prototype.isPrototypeOf(books)
  ) {
    res.status(400).send({
      msg: "Please fill in the required field(s)",
    });
  } else {
    TypeSession.findOne({ active: true })
      .then((session) => {
        var listOfBook = new ListOfBook({
          className,
          uploaderId,
          category,
          session,
          books,
        });
        book.forEach((element, n) => {
          book[n].uploaderId = uploaderId;
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
      })
      .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
  }
};

exports.listOfBook = function (req, res) {
  ListOfBook.find({})
    .populate("session")
    .sort({ createdAt: -1 })
    .exec((err, lists) => {
      if (err) {
        res.status(500).send({
          msg: "Something went wrong",
        });
      } else {
        if (lists.length > 0) {
          res.send(lists);
        } else {
          res.status(400).send({
            msg: "No List of Books Collection yet",
          });
        }
      }
    });
};

exports.getListOfBook = function (req, res) {
  const { className, session } = req.body;

  if (!className || !session) {
    res.status(400).sen("Incomplete info");
  } else {
    ListOfBook.find({ className, session })
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
  }
};
//ISSUES
exports.getListOfBookSuject = function (req, res) {
  const { className, subject } = req.body;
  if (!className || !subject) {
    res.status(400).sen("Incomplete info");
  } else {
    ListOfBook.find({ className })
      .populate()
      .sort({ createdAt: -1 })
      .exec()
      .then((lists) => {
        if (lists.length > 0) {
          //Here get only subject books
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
  }
};

exports.addBookToList = function (req, res) {
  //pass an array of books
  const { id, uploaderId, className, book } = req.body;

  if (
    !id ||
    !className ||
    !uploaderId ||
    !Object.prototype.isPrototypeOf(book)
  ) {
    res.status(400).sen("Incomplete info");
  } else {
    ListOfBook.findOne({ _id: id, uploaderId })
      .then((list) => {
        if (list) {
          book.forEach((element, n) => {
            book[n].uploaderId = uploaderId;
          });
          list.book.push(book);
          list.save((err, saved) => {
            if (err) {
              res.status(500).send("Something went wrong");
            } else {
              res.send(saved);
            }
          });
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
  }
};

exports.removeBookFromList = (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).send("Incomplete info");
  } else {
    ListOfBook.books
      .id(id)
      .remove()
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send("Something went wrong"));
  }
};
exports.deleteListOfBook = function (req, res) {
  const { _id, uploaderId } = req.body;

  ListOfBook.deleteOne({
    _id,
    uploaderId,
  })
    .then((removed) => {
      res.send(`${removed.n} item(s) removed`);
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
    });
};
exports.removeSubjectBook = (req, res) => {
  const { id, subject } = req.body;

  ListOfBook.findOne({ _id: id })
    .then((list) => {
      //calling anonymous function
      (async function () {
        await Book.deleteMany({ subject });
      }.call({}));
      const books = list.books.filter((elem) => elem.subject !== subject);
      list.books = books;
      ListOfBook.save((err, saved) => {
        if (err) {
          res.status(500).send("Something went wrong");
        } else {
          res.send(saved);
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Something went wrong",
      });
    });
};
exports.updateListOfBook = function (req, res) {
  const { className, id, uploaderId, category } = req.body;
  if (!id || !uploaderId || !className) {
    res.status(400).send({
      msg: "Please fill in the required field(s)",
    });
  } else {
    ListOfBook.updateOne(
      { _id: id, uploaderId, className },
      {
        className,
        category,
      },
      { omitUndefined: true }
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
exports.updateBook = (req, res) => {
  const {
    id,
    uploaderId,
    name,
    section,
    subject,
    details,
    authors,
    volume,
    publisher,
    published,
    isbn,
    edition,
  } = req.body;
  if (!id || !uploaderId) {
    res.status(400).send("Incomplete info");
  } else {
    Book.updateOne(
      { _id: id, uploaderId },
      {
        name,
        section,
        subject,
        authors,
        student,
        details,
        volume,
        publisher,
        published,
        isbn,
        edition,
      },
      { omitUndefined: true }
    )
      .then((book) => {
        if (book) {
          res.send(book);
        } else {
          res.status(500).send("Error");
        }
      })
      .catch((err) => res.status(500).send("Something went wrong " + err.msg));
  }
};
//get list by subject***
//addBookToList***
//authorToBook***[done with update]
//Remove Book from list //Removes from book model too***
//Remove all Books with particular subject from list***
//Remove Section from list***[done with update]

/*/Add list of book ======
      Add entire
      Add book to subject
      Add author to book
      Add an item to a subject
      Add a subject
  Update list of books ============
      Change name of subject
      Change name of class
      Change name of section
      Change author details
      Change name of book
      Change year of publishing book
      Change SSID of book
  Delete list of books ===================
      section
      subject
      book
      author
  Get List of books =================
      Session
      Class
      ALL
      Subject


A list of book is divided into classes and classes may be divided into sections like 
science, commercial, arts
Then these classes/sections have several subjects under then
Subjects have books
Books may have child elements that come with them (elements like workbook)
these books may be  compulsory or not
Books have authors, publication numbers, year of publishing, an optional
publisher, an edition etc and any of these can be edited

  list of book: {
    uploaderId: "",
    session: "",
    classNameId: "",
  }
  book: [{
    name:"",
    section: null,
    subject:""
    authors: [""],
    student: [""],
    publisher: "",
    published: "",
    ISID-no: "",
    edition: ""
  }]
*/
