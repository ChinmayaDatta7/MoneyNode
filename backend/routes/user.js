import express from "express";
import Zod from "zod";
import jwt from "jsonwebtoken";
import User from "../db";
import { JWT_SECRET } from "../config";

const router = express.Router();

const signupBody = Zod.object({
  username: Zod.string().email(),
  firstName: Zod.string().min(2).max(50),
  lastName: Zod.string().min(2).max(50),
  password: Zod.string().min(8),
});

router.post("/signup", async (req, res) => {
  const { success, data } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({ username: data.username });
  if (existingUser) {
    return res.status(411).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create(data);

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({
    msg: "User created successfully",
    token: token,
  });
});

const loginBody = Zod.object({
  username: Zod.string().email(),
  password: Zod.string().min(8),
});

router.post("/login", async (req, res) => {
  const { success, data } = loginBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: data.username,
    password: data.password,
  });
  if (!user) {
    return res.status(411).json({
      msg: "Error while logging in",
    });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({
    token: token,
  });
});

export default router;
