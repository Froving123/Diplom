const Router = require("express");
const router = new Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/categories", deliveryController.getCategories);
router.get("/price", deliveryController.getPriceList);
router.get("/discount", deliveryController.getDiscountedItem);
router.get("/menu", deliveryController.getMenu);

module.exports = router;
