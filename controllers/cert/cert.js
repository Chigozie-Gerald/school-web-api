const Result = require("../../models/result");
const Cert = require("../../models/cert");

//Certifying a session allows us to create a new one
exports.certifySession = (req, res) => {
  const { session } = req.body;
  if (!session) {
    res.status(400).send("Incomplete info");
  } else {
    Result.find()
      .limit(1000)
      .then((result) => {
        console.log(
          result[0].result[result[0].result.length - 1][0].session,
          session,
          "mdmdmmdmdmddm"
        );
        if (result.length > 0) {
          const checker = result.some((a) => {
            return a.result[a.result.length - 1][0].session === session;
          });
          if (checker) {
            Cert.findOne()
              .then((cert) => {
                if (cert) {
                  cert.session = session;
                  cert.save((err, save) => {
                    if (err) {
                      res.status(500).send({
                        msg: "Something went wrong",
                      });
                    } else {
                      res.send("Cert created successfuly");
                    }
                  });
                } else {
                  const newCert = new Cert({ session });
                  newCert.save((err, save) => {
                    if (err) {
                      res.status(500).send({
                        msg: "Something went wrong",
                      });
                    } else {
                      res.send("Cert created successfuly");
                    }
                  });
                }
              })
              .catch(() =>
                res.status(500).send({
                  msg: "Something went wrong",
                })
              );
          } else {
            res.status(500).send({
              msg: "The session you wish to certify has no references1",
            });
          }
        } else {
          res
            .status(500)
            .send({ msg: "The session you wish to certify has no references" });
        }
      })
      .catch((err) =>
        res.status(500).send({ msg: "Something went wrong" + err })
      );
  }
};

exports.getCertified = (req, res) => {
  Cert.find()
    .then((cert) => res.send(cert))
    .catch((err) => res.status(500).send({ msg: "Something went wrong" }));
};
