const Router = require("express");
const router = new Router();
const adminController = require("../controllers/adminController");

router.post("/create-password", adminController.createPassword);
router.post("/login", adminController.login);
router.get("/roleGet", adminController.roleAdmins);
router.get("/profile", adminController.admin);

module.exports = router;
