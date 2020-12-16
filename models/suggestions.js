const mongoose = require("mongoose")
const Schema = mongoose.Schema

const suggestionModel = new Schema({
  email:{type: String, default:""},
  body:{type: String, default:"", required= true},
  category:{type: String, default:"", required=true},
  phone:{type: Number, default:""},
  name:{type: String, default:""},
})

module.exports = mongoose.model('Suggestion', suggestionModel)