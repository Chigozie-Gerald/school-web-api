var express = require("express");
var router = express.Router();

landing = require("../controllers/register/landing");
const news = require("../controllers/news/news");
const suggestion = require("../controllers/externals/suggestion");
const cert = require("../controllers/cert/cert");
const type = require("../controllers/types/create");
//Auth Checks
const { auth } = require("../middleware/auth");
const { admin, editor } = require("../middleware/admin");

//landings
router.get("/", landing.homepage);
router.post("/newSchool", landing.newSchool);
router.get("/user", auth, landing.userData);

//News
router.post("/createNews", news.createNews);
router.get("/getNews", news.getNews);
router.post("/findNews", news.findNews);
router.post("/editNews", news.editNews);
router.post("/deleteAllNews", news.deleteAllNews);
router.post("/deleteNews", news.deleteNews);
//Suggestions
router.post("/createSuggestion", suggestion.createSuggestion);
router.post("/deleteAllSuggestions", suggestion.deleteAllSuggestions);
router.post("/deleteSuggestion", suggestion.deleteSuggestion);
router.post("/replySuggestion", suggestion.replySuggestion);
router.get("/viewAllSuggestions", suggestion.viewAllSuggestions);
router.post("/viewSuggestion", suggestion.viewSuggestion);

//Cert
router.post("/certifySession", editor, cert.certifySession);

//Types add middleware here
router.get("/allTypes", editor, type.allTypes);
router.get("/deleteAllTypes", editor, type.deleteAllTypes);
router.post("/createType", editor, type.createType);
router.post("/deleteTypeFee", editor, type.deleteTypeFee);
router.post("/deleteTypeSect", editor, type.deleteTypeSect);
router.post("/addTypeSect", editor, type.addTypeSect);
router.post("/editTypeSect", editor, type.editTypeSect);

module.exports = router;
