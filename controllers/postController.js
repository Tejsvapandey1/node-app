const Post = require("../models/postModel");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    console.log(posts);
    res.status(200).json({
      status: "Success",
      result: posts.length,
      data: posts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post)
    res.status(200).json({
      status: "Success",
      data: {title:post.id,content:post.body},
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "fail",
      error: e.message
    });
  }
};

exports.createPost = async (req, res, next) => {
    try {
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content  
      });
  
      res.status(201).json({
        status: "Success",
        data: post,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "fail",
        message: e.message,
      });
    }
  };
  

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "updated",
      data: post,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.deletePost = async (req, res, next) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: "deleted",
       
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: "fail",
      });
    }
  };
