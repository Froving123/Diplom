const Router = require("express");
const router = new Router();
const contmanController = require("../controllers/contmanController");

router.get("/hideMenu", contmanController.getHideMenu);
router.get("/hideCategories", contmanController.getHideCategories);
router.post("/updateDish", contmanController.updateDish);
router.post("/hideDish", contmanController.hideDish);
router.post("/recoveryDish", contmanController.hideDish);
router.post("/removeDish", contmanController.removeDish);
router.get("/categories", contmanController.getCategories);
router.post("/hideCategories", contmanController.hideCategory);
router.post("/recoveryCategories", contmanController.recoveryCategory);
router.post("/removeCategory", contmanController.removeCategory);
router.post("/updateCategory", contmanController.updateCategory);
router.post("/addDish", contmanController.addDish);
router.post("/addCategory", contmanController.addCategory);
router.get("/offerGet", contmanController.getAllOffers);
router.get("/hideOfferGet", contmanController.getHideOffers);
router.post("/offerHide", contmanController.hideOffer);
router.post("/offerRecovery", contmanController.recoveryOffer);
router.post("/offerDelete", contmanController.deleteOffer);
router.post("/offerCreate", contmanController.createOffer);
router.get("/dishOffer", contmanController.activeDish);
router.get("/reviewGet", contmanController.getAllReview);
router.post("/reviewDelete", contmanController.deleteReview);

module.exports = router;
