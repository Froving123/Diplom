const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const reservationRouter = require("./reservationRouter");

router.use("/user", userRouter);
router.use("/reservation", reservationRouter);

module.exports = router;
