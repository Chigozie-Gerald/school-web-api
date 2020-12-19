var express = require("express");
var app = express();
var mongoose = require("mongoose");
profileRouter = require("./routes/profile");

//connect mongodb
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
indexRouter = require("./routes/home");

app.use("/api", indexRouter);
app.use("/api/profile", profileRouter);

app.listen(
  3040,
  mongoose
    .connect("mongodb://127.0.0.1/testing", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo connected...");
      console.log("Server started on port 3040");
    })
    .catch((err) => console.log(err))
);
