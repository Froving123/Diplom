const Router = require("express");
const router = new Router();
const deliveryController = require("../controllers/deliveryController");

router.post("/create", deliveryController.createOrder);
router.get("/menu", deliveryController.menuDelivery);
router.get("/user", deliveryController.userDelivery);

module.exports = router;
