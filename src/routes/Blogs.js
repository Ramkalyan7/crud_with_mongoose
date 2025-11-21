import { Router } from "express";
import { AuthMiddleware } from "../Middleware.js";
import { Blog } from "../models/Blog.js";

export const blogRouter = Router();
blogRouter.use(AuthMiddleware)

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

blogRouter.post("/create", async (req, res) => {
  try {
    const user = req.user;
    const { title, description } = req.body;

    const blog = await Blog.create({
      title,
      description,
      user: user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while creating the blog" });
  }
});

blogRouter.get("/:id" ,async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching the blog" });
  }
});

blogRouter.get("/delete/:id",async(req,res)=>{
    try {
        const {id}=req.params
        const blog = await Blog.findByIdAndDelete(id);
        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
    res.status(500).json({ message: "Error while fetching the blog" });
    }
})


blogRouter.get("/user/blogs",async(req,res)=>{
    try {
     
        const id = req.user.user._id;

        console.log(id)
        const blogs = await Blog.find({user:id}).populate("User");
        console.log(blogs)
        res.status(200).json(blogs)

    } catch (error) {
        console.log(error)
       res.status(500).json({ message: "error occured" });
    }
})