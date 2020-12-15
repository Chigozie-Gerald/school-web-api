const NewsReport = require("../../models/news");

exports.newsChecker = (body) => {
  let wrongBody = [];
  body.map((elem, n) => {
    //the length below was taken directly from the model
    //if model is changed, endure to update
    if (
      Object.keys(elem).length < 2 ||
      !Object.keys(elem).includes("text") ||
      !Object.keys(elem).includes("quote")
    ) {
      wrongBody.push(n);
    } else return;
  });
  return wrongBody;
};
exports.createNews = (req, res) => {
  const { uploaderId, body, title, summary } = req.body;

  if (
    !uploaderId ||
    !Array.prototype.isPrototypeOf(body) ||
    body.length < 1 ||
    !title ||
    !summary
  ) {
    res.status(400).send({
      msg: "Incomplete Info",
    });
  } else {
    if (this.newsChecker(body).length > 0) {
      res.status(400).send({
        msg: `Body with index ${this.newsChecker(
          body
        )} not formatted correctly`,
      });
    } else {
      const newReport = new NewsReport({
        uploaderId,
        body,
        title,
        summary,
      });
      newReport.save((err, news) => {
        if (err) {
          res.status(500).send({
            msg: "Something went wrong",
            err,
          });
        } else {
          res.send({ news });
        }
      });
    }
  }
};

exports.getNews = (req, res) => {
  NewsReport.find()
    .then((news) => {
      res.send({
        count: news.length,
        msg: news,
      });
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.findNews = (req, res) => {
  const { id } = req.body;
  NewsReport.findOne({ _id: id })
    .then((news) => {
      if (!news) {
        res.send({ msg: "News not found" });
      } else {
        res.send({
          msg: news,
        });
      }
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.deleteAllNews = (req, res) => {
  NewsReport.deleteMany()
    .then(() => {
      res.send({
        msg: "All News deleted",
      });
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.deleteNews = (req, res) => {
  const { id, uploaderId } = req.body;
  NewsReport.deleteOne({ _id: id, uploaderId })
    .then(() => {
      res.send({
        msg: "News deleted",
      });
    })
    .catch(() => res.status(500).send({ msg: "Something went wrong" }));
};

exports.editNews = (req, res) => {
  const { id, uploaderId, body, title, summary } = req.body;
  if (
    !id ||
    !uploaderId ||
    !Array.prototype.isPrototypeOf(body) ||
    body.length < 1 ||
    !title ||
    !summary
  ) {
    res.status(400).send({
      msg: "Incomplete info",
    });
  } else {
    if (this.newsChecker(body).length > 0) {
      res.status(400).send({
        msg: "Message not formatted correctly",
      });
    } else {
      NewsReport.updateOne({ _id: id, uploaderId }, { body, title, summary })
        .then((news) => {
          res.send({
            msg: news,
          });
        })
        .catch(() => res.status(500).send({ msg: "Something went wrong" }));
    }
  }
};
