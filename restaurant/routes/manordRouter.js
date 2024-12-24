const Router = require("express");
const router = new Router();
const manordController = require("../controllers/manordController");

router.get("/newOrdersGet", manordController.getNewOrders);
router.post("/cancelOrder", manordController.cancelOrder);
router.post("/acceptOrder", manordController.acceptOrder);
router.get("/acceptOrdersGet", manordController.getAcceptOrders);
router.post("/readyOrder", manordController.readyOrder);

module.exports = router;
