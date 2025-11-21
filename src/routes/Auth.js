import { Router } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.get("/", (req, res) => {
  return res.send("hello world from auth");
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    console.log(existingUser);

    if (existingUser) {
      res.status(403).json({ message: "User with email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 3);

    const user = await User.create({ email, password: hashedPassword });

    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while Registering User" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordVerified = await bcrypt.compare(password, user.password);

    if (!isPasswordVerified) {
      res.status(404).json("Invalid email or password");
      return;
    }


    const token = jwt.sign({user:user}, process.env.JWT_SECRET);

    if (!token) {
      res.status(500).json({ message: "Error while Creating Token" });
      return;
    }

    res.status(200).json(token);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Unexpected Error occured while loggin in" });
  }
});
