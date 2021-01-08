const mongoose = require("mongoose");
const {
  sessionType,
  termType,
  subjectType,
  armType,
} = require("../controllers/types");
const { getClassName, isSeniorSub } = require("../controllers/types/getTypes");
const Schema = mongoose.Schema;
const days = ["mon", "tue", "wed", "thurs", "fri", "sat", "sun"];

const periodSchema = new Schema({
  session: sessionType,
  term: termType,
  period: [
    {
      _id: false,
      term: {
        type: Number,
        min: 1,
        required: true,
        validate: {
          validator: function (value) {
            return value <= this.term;
          },
          message: "Term validationfailed",
        },
      },
      subject: subjectType,
      className: {
        type: Schema.Types.ObjectId,
        ref: "Type.className",
        required: true,
        validate: {
          validator: function (value) {
            return getClassName({
              className: value,
              senior: isSeniorSub(this.subject),
            });
          },
          message: "ClassName cross Subject (senior) validation failed",
        },
      },
      arm: armType,
      day: { type: String, enum: days, required: true },
      start: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return this.stop > value;
          },
          message: "Start time cannot be later than stop time",
        },
      },
      stop: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value > this.start;
          },
          message: "Stop time cannot be earlier than start time",
        },
      },
    },
  ],
});
/*
Structure of input

{
  session:"",
  periodArray:[ /first loop
    {
      className:"",
      arm:"",
      period:[
                [{day, subject, start, stop, term}], //second loop
                [],
                []
      ] with the length here equaling the terms for the session type
    },
    {}
  ]
}


Structure of output
[
  {
    className:"",
    arm,
    day, // Remains same
    subject, // Remains same
    start, // Remains same
    stop, // Remains same
    term // Remains same
  }
]
*/
/*
What happens when someone adds a period for a particular class arm withn inconsistent timing
[{
  className: "",
  arm: "",
  period:[[{day, start, stop, term}],[{},{}]]
}]
i am sorting based on 2 criterias
-term -day
first sort by term(or term should be put in arrays that signify their values), term now has seperate arrays, then sort by day
{class1}, {class2}
*/
module.exports = mongoose.model("Period", periodSchema);
/**
 subject:{
   term:1,
   subject:"english",
   day:"monday",
   start:9,
   stop:10
 }

 */
