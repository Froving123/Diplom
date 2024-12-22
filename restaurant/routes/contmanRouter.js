const Router = require("express");
const router = new Router();
const contmanController = require("../controllers/contmanController");

router.post("/priceDeliv", contmanController.newPrice);
router.get("/offerGet", contmanController.getAllOffers);
router.post("/offerUpdate", contmanController.updateOffer);
router.get("/offerDelete", contmanController.deleteOffer);
router.post("/offerCreate", contmanController.createOffer);

module.exports = router;
