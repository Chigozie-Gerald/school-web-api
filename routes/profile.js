var express = require(`express`);
var router = express.Router();

var register = require("../controllers/register/register");
var login = require("../controllers/register/login");
var result = require("../controllers/staff/result");
var assignment = require("../controllers/assignment/assignment");
var listOfBook = require("../controllers/listOfBooks/listOfBook");
var fee = require("../controllers/payments/fee");

const { auth } = require("../middleware/auth");
const { admin, editor } = require("../middleware/admin");

//Routes
//Login & Register
router.post("/little", register.little);
router.get("/student", register.getStudent);
router.get("/login/:student_id", auth, login.showStudent);
router.post("/register", register.postRegister);
router.post("/edit_profile", register.editProfile);
router.post("/login", login.postLogin);
router.post("/forgotten_password", register.forgotten_password);
router.post("/change_password/:token", register.changePassword);
router.post("/registerSchool", register.registerSchool);
router.post("/registerStaff", register.registerStaff);
//Result
//add middleware later
router.post("/result", result.postResult);
router.post("/check_result", result.postGetResult);
//admin
router.post("/get_all_new_result", admin, result.getAllNewResult);
router.post("/get_new_result", result.getNewResult);
//admin
router.get("/delete_all_new_result", admin, result.deleteAllNewResult);
router.post("/delete_last_new_result", result.deleteLastNewResult);
router.post("/new_result", result.newResult);
router.post("/edit_result_sub", result.editResultSub);
router.post("/add_result_subject", result.addResultSub);
router.post("/remove_result_subject", result.removeResultSub);
router.post("/get_term_result", result.getTermResult);

//admin for all 3
router.post("/edit_result_sub_admin", admin, result.editResultSub);
router.post("/add_result_subject_admin", admin, result.addResultSub);
router.post("/remove_result_subject_admin", admin, result.removeResultSub);
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
router.post("/get_admin_fee", editor, fee.getAdminFee);
router.post("/get_staff_fee", auth, fee.getStaffFee);
router.post("/get_student_fee", auth, fee.getStudentFee);
router.post("/post_fee", auth, admin, fee.postFee);
router.post("/delete_fee", auth, fee.deleteFee);
router.post("/update_fee", auth, fee.updateFee);

module.exports = router;
