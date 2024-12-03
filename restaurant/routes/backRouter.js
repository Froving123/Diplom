const Router = require("express");
const router = new Router();
const backController = require("../controllers/backController");

router.post("/create", backController.createFeedback);
router.get("/user", backController.userFeedback);

module.exports = router;
