const Staff = require("../../models/staff");
const Suggestion = require("../../models/suggestions");

exports.createSuggestion = (req, res) => {
  const { email, body, category, phone, name } = req.body;
  if (!body || !category) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    const newSuggestion = new Suggestion({
      email,
      body,
      category,
      phone,
      name,
    });

    newSuggestion.save((err, newSug) => {
      if (err) {
        res.status(500).send({
          msg: "Something went wrong",
        });
      } else {
        res.send({
          msg: "Successful",
        });
      }
    });
  }
};

exports.deleteSuggestion = (req, res) => {
  const { id, uploaderId } = req.body;

  if (!id || !!uploaderId) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    Suggestion.deleteOne({ _id: id })
      .then(() => res.send({ msg: "Deletion successful" }))
      .catch(() => res.status(500).send({ msg: "Something went wrong" }));
  }
};

exports.deleteAllSuggestions = (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).send({ msg: "Incomplete info" });
  } else {
  }
  Staff.findOne({ _id: id })
    .then((staff) => {
      if (staff && staff.editor) {
        Suggestion.deleteMany()
          .then(() => res.send({ msg: "All suggestions deleted" }))
          .catch(() => res.status(500).send({ msg: "Something went wrong" }));
      } else {
        res.status(400).send({
          msg: "Something went wrong",
        });
      }
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.replySuggestion = (req, res) => {};

exports.viewSuggestion = (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    Suggestion.findOne({
      _id: id,
    })
      .then((sug) => {
        if (sug) {
          res.send({ msg: sug });
        } else {
          res.status(500).send({
            msg: "Suggestion not found",
          });
        }
      })
      .catch(() => res.status(500).send({ msg: "Something went wrong" }));
  }
};

exports.viewAllSuggestions = (req, res) => {
  Suggestion.find()
    .then((suggs) => {
      if (suggs.length) {
        res.send({ msg: suggs });
      } else {
        res.status(400).send({
          msg: "No suggestions yet",
        });
      }
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};
