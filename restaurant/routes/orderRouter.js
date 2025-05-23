const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

router.get("/payment", orderController.paymentOrder);
router.post("/create", orderController.createOrder);
router.post("/remove", orderController.removeOrder);
router.get("/user", orderController.userOrder);

module.exports = router;
