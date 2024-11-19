const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.post("/registration", (req, res) => {
  userController.registration(req, res);
});
router.post("/login", userController.login);
router.get("/auth", userController.check);

module.exports = router;
