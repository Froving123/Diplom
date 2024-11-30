const Router = require("express");
const router = new Router();
const bucketController = require("../controllers/bucketController");

router.post("/create", bucketController.createBucket);
router.post("/foot", bucketController.createFootDelivery);
router.get("/user", bucketController.userBucket);
router.post("/increment", bucketController.incrementProductQuantity);
//router.post("/decrement", bucketController.decrementProductQuantity);

module.exports = router;
