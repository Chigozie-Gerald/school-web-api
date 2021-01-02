const mongoose = require("mongoose");
const {
  classNameType,
  sessionType,
  subjectType,
  staffType,
  studentType,
  categoryType,
} = require("../controllers/types/.");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  uploaderId: staffType,
  name: { type: String, unique: true, trim: true, required: true },
  section: { type: String, trim: true },
  subject: subjectType,
  details: { type: String, trim: true },
  authors: [{ type: String, trim: true, required: true }],
  //Students represent students interested in the book
  student: [studentType],
  volume: { type: Number },
  publisher: { type: String, trim: true },
  published: { type: Number },
  isbn: { type: Number },
  edition: { type: Number, required: true },
});

const listOfBookSchema = new Schema({
  className: classNameType,
  uploaderId: staffType,
  category: categoryType,
  session: sessionType,
  books: [bookSchema],
  createdAt: { type: Number, default: Date.now },
});

listOfBookSchema.pre("save", function (next) {});

exports.Book = mongoose.model("Book", bookSchema);
exports.ListOfBook = mongoose.model("ListOfBook", listOfBookSchema);
