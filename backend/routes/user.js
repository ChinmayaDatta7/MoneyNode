import express from "express";
import Zod from "zod";
import jwt from "jsonwebtoken";
import { User } from "../db";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";

const router = express.Router();

const signupBody = Zod.object({
  username: Zod.string().email(),
  firstName: Zod.string().min(2).max(50),
  lastName: Zod.string().min(2).max(50),
  password: Zod.string().min(8),
});

//route for signup
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

  //create account for user with random balance between 1 and 10000
  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 10000,
  });

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

//route for login
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

const updatedBody = Zod.object({
  password: Zod.string().min(8),
  firstName: Zod.string().min(2).max(50),
  lastName: Zod.string().min(2).max(50),
});

//route for updating user information
router.put("/", authMiddleware, async (req, res) => {
  const { success, data } = updatedBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.userId }, data);
  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  //find users by first name or last name
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
    })),
  });
});

export default router;
