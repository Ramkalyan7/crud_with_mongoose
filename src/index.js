import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routes/Auth.js";
import { blogRouter } from "./routes/blogs.js";
import "dotenv/config";


const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/blogs", blogRouter);

const connectToDB = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_URL);
  if (conn) {
    console.log("Connected to DB successfully");
  } else {
    console.log("Cannot connect to database");
  }
};


connectToDB();
app.listen(3000, () => {
  console.log("listening on Port 3000");
});
