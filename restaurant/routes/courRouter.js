const Router = require("express");
const router = new Router();
const courController = require("../controllers/courController");

router.get("/readyOrdersGet", courController.getReadyOrders);
router.post("/acceptOrder", courController.acceptOrder);
router.get("/courOrdersGet", courController.getCourOrders);
router.post("/completeOrder", courController.completeOrder);

module.exports = router;