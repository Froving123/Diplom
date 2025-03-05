const Router = require("express");
const router = new Router();
const reservmanController = require("../controllers/reservmanController");

router.get("/reservGet", reservmanController.getAllReserv);
router.post("/reservDelete", reservmanController.deleteReserv);

module.exports = router;
