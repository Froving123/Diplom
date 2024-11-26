const Router = require("express");
const router = new Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/categories", deliveryController.getCategories);
router.get("/menu", deliveryController.menuDelivery);
router.get("/price-list", deliveryController.getPriceList);
router.post("/bucket", deliveryController.createBucket);
router.post("/foot", deliveryController.createFootDelivery);
router.post("/order", deliveryController.createOrder);
router.get("/user", deliveryController.userDelivery);

module.exports = router;
