var express = require("express");
var router = express.Router();

landing = require("../controllers/register/landing");
const auth = require("../middleware/auth");

//landings
router.get("/", landing.homepage);
router.post("/newSchool", landing.newSchool);
router.get("/user", auth, landing.userData);

module.exports = router;
