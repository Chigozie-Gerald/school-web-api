var express = require("express");
var router = express.Router();

landing = require("../controllers/register/landing");
const news = require("../controllers/news/news");
const suggestion = require("../controllers/externals/suggestion");
const type = require("../controllers/types/create");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const section = require("../middleware/section");

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

//Types
router.post("/viewSuggestion", type.createType);
router.post("/deleteTypeSect", type.deleteTypeSect);
router.post("/addTypeSect", type.addTypeSect);

module.exports = router;
