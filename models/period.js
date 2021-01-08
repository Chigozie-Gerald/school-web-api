const mongoose = require("mongoose");
const { virtuals } = require(".");
const {
  sessionType,
  termType,
  subjectType,
  armType,
} = require("../controllers/types");
const { getClassName, isSeniorSub } = require("../controllers/types/getTypes");
const Schema = mongoose.Schema;
const days = ["mon", "tue", "wed", "thurs", "fri", "sat", "sun"];

periodSchema = new Schema(
  {
    session: sessionType,
    term: termType,
    start: {
      _id: false,
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === this.term * days.length;
        },
        message: "Invalid Stop Format in Periods",
      },
    },
    stop: {
      _id: false,
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === this.term * days.length;
        },
        message: "Invalid Stop Format in Periods",
      },
    },

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
          validate: function (value) {
            return getClassName({
              className: value,
              senior: isSeniorSub(this.subject),
            });
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
      virtuals,
    ],
  },
  virtuals
);
periodSchema.path("period").schema.set("toJSON", { virtuals: true });
const periodStartVirtual = periodSchema
  .path("period")
  .schema.virtual("startVal");
const periodStopVirtual = periodSchema.virtual("stopVal");
periodStopVirtual.get(function () {
  return "bush";
});
periodStartVirtual.get(function () {
  // console.log(this.parent().period);

  return this.start + 40;
});
/*
Structure of input
start = []
top = [{}, 1,2,3,4,5,6,7,1,2,3,4,5,6,7,1,2,3,4,5,6,7]
getDayDiff = (day)=>{
  const index = days.indexOf(day)
  if(index === -1){
    throw "Provide a valid day"
  }else{
    return stop[index] - start[index]
  }
}
start, stop
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
