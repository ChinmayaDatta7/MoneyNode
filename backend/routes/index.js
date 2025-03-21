import express from "express";
const userRouter = require("./user.js");

const router = express.Router();

router.use("/user", userRouter);

export default router;
