const Router = require("express");
const router = new Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/menu", deliveryController.menuDelivery);
router.post("/bucket", deliveryController.createBucket);
router.post("/foot", deliveryController.createFootDelivery);
router.post("/order", deliveryController.createOrder);
router.get("/user", deliveryController.userDelivery);

module.exports = router;
