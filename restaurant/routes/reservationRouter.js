const Router = require("express");
const router = new Router();
const reservationController = require("../controllers/reservationController");

router.post("/create", reservationController.createReservation);
router.get("/user", reservationController.userReservation);

module.exports = router;
