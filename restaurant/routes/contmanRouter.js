const Router = require("express");
const router = new Router();
const contmanController = require("../controllers/contmanController");

router.post("/updateDish", contmanController.updateDish);
router.post("/removeDish", contmanController.removeDish);
router.get("/categories", contmanController.getCategories);
router.post("/removeCategory", contmanController.removeCategory);
router.post("/updateCategory", contmanController.updateCategory);
router.post("/addDish", contmanController.addDish);
router.post("/addCategory", contmanController.addCategory);
router.get("/offerGet", contmanController.getAllOffers);
router.post("/offerDelete", contmanController.deleteOffer);
router.post("/offerCreate", contmanController.createOffer);
router.get("/dishOffer", contmanController.activeDish);
router.get("/reviewGet", contmanController.getAllReview);
router.post("/reviewDelete", contmanController.deleteReview);

module.exports = router;
