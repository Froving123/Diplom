const Router = require("express");
const router = new Router();
const bucketController = require("../controllers/bucketController");

router.post("/foot", bucketController.createFootDelivery);
router.post("/increment", bucketController.incrementProductQuantity);
router.post("/decrement", bucketController.decrementProductQuantity);
router.post("/remove", bucketController.removeProduct);
router.get("/user", bucketController.userBucket);
router.get("/total-price", bucketController.getTotalPrice);

module.exports = router;
