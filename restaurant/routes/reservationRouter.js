const Router = require("express");
const router = new Router();
const reservationController = require("../controllers/reservationController");

router.post("/create", reservationController.createReservation);
router.get("/tables", reservationController.tablesReservation);
router.get("/user", reservationController.userReservation);
router.get("/active-tables", reservationController.activeTables);

module.exports = router;
