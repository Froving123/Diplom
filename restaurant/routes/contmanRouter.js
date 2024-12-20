const Router = require("express");
const router = new Router();
const contmanController = require("../controllers/contmanController");

router.post("/price", contmanController.newPrice);

module.exports = router;
