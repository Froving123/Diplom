const Router = require("express");
const router = new Router();
const bucketController = require("../controllers/bucketController");

router.post("/create", bucketController.createBucket);
router.post("/foot", bucketController.createFootDelivery);

module.exports = router;
