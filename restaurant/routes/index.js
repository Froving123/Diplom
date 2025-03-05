const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const reservationRouter = require("./reservationRouter");
const deliveryRouter = require("./deliveryRouter");
const bucketRouter = require("./bucketRouter");
const orderRouter = require("./orderRouter");
const backRouter = require("./backRouter");
const adminRouter = require("./adminRouter");
const contmanRouter = require("./contmanRouter");
const manordRouter = require("./manordRouter");
const courRouter = require("./courRouter");
const reservmanRouter = require("./reservmanRouter");

router.use("/user", userRouter);
router.use("/reservation", reservationRouter);
router.use("/delivery", deliveryRouter);
router.use("/bucket", bucketRouter);
router.use("/order", orderRouter);
router.use("/feedback", backRouter);
router.use("/admin", adminRouter);
router.use("/contman", contmanRouter);
router.use("/manord", manordRouter);
router.use("/cour", courRouter);
router.use("/reservman", reservmanRouter);

module.exports = router;
