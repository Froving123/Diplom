const Router = require("express");
const router = new Router();
const reservationController = require("../controllers/reservationController");

router.get("/tables", reservationController.tablesReservation);
router.post("/create", reservationController.createReservation);
router.get("/active-tables", reservationController.activeTables);
router.post("/remove", reservationController.removeReserv);
router.get("/user", reservationController.userReservation);

module.exports = router;
