const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const reservationRouter = require("./reservationRouter");
const deliveryRouter = require("./deliveryRouter");

router.use("/user", userRouter);
router.use("/reservation", reservationRouter);
router.use("/delivery", deliveryRouter);

module.exports = router;
