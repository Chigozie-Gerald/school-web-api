var express = require(`express`);
var router = express.Router();

var register = require("../controllers/register/register");
var news = require("../controllers/news/news");
var login = require("../controllers/register/login");
var result = require("../controllers/staff/result");
var assignment = require("../controllers/assignment/assignment");
var listOfBook = require("../controllers/listOfBooks/listOfBook");
var fee = require("../controllers/payments/fee");

const auth = require("../middleware/auth");

//Routes
//Login & Register
router.get("/student", register.getStudent);
router.get("/login/:student_id", auth, login.showStudent);
router.post("/register", register.postRegister);
router.post("/edit_profile", register.editProfile);
router.post("/login", login.postLogin);
router.post("/forgotten_password", register.forgotten_password);
router.post("/change_password/:token", register.changePassword);
router.post("/registerSchool", register.registerSchool);
router.post("/registerStaff", register.registerStaff);
//News
router.post("/createNews", news.createNews);
router.get("/getNews", news.getNews);
router.post("/findNews", news.findNews);
router.post("/editNews", news.editNews);
router.post("/deleteAllNews", news.deleteAllNews);
router.post("/deleteNews", news.deleteNews);
//Result
router.post("/result", auth, result.postResult);
router.post("/check_result", auth, result.postGetResult);
//remember to be able to update and delete a result entry
//Assignment
router.get("/assignment", assignment.assignment);
router.post("/post_assignment", auth, assignment.postAssignment);
router.post("/get_assignment", auth, assignment.getAssignment);
router.post("/delete_assignment", auth, assignment.deleteAssignment);
router.post("/update_assignment", auth, assignment.updateAssignment);
//list of Book
router.get("/listOfBook", listOfBook.listOfBook);
router.post("/get_listOfBook", auth, listOfBook.getListOfBook);
router.post("/post_listOfBook", auth, listOfBook.postListOfBook);
router.post("/delete_listOfBook", auth, listOfBook.deleteListOfBook);
router.post("/update_listOfBook", auth, listOfBook.updateListOfBook);
//Fees
router.get("/fee", fee.fee);
router.post("/post_fee", auth, fee.postFee);
router.post("/delete_fee", auth, fee.deleteFee);
router.post("/get_fee", auth, fee.getFee);
router.post("/update_fee", auth, fee.updateFee);

module.exports = router;
