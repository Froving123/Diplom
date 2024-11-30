const Router = require("express");
const router = new Router();
const bucketController = require("../controllers/bucketController");

router.post("/create", bucketController.createBucket);
router.post("/foot", bucketController.createFootDelivery);
router.post("/increment", bucketController.incrementProductQuantity);
router.post("/decrement", bucketController.decrementProductQuantity);
router.post("/remove", bucketController.removeProduct);
router.get("/user", bucketController.userBucket);
router.get("/check-items", bucketController.checkCartItems);

module.exports = router;
