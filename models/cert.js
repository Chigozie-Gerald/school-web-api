const mongoose = require("mongoose");
const { sessionType } = require("../controllers/types");
const Schema = mongoose.Schema;

const certSchema = new Schema({
  session: sessionType,
});

module.exports = mongoose.model("Cert", certSchema);
