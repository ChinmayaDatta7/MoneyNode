import express from "express";
const userRouter = require("./user.js");
const accountRouter = require("./account.js");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;
