const { response } = require("express");
const Articles = require("../models/articleModel");
const Users = require("../models/userModel");

const addArticle = async (req, res) => {
  try {
    const email = req.email;
    const author = await Users.findOne({ email });

    const id = author._id;
    const { title, body } = req.body.data;
    if (!title || !body) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log('checkpost 1');
    const article = await Articles.create({ title, body });
    article.author = id;
    console.log('checkpost 2');
    await article.save();
    const articleData = await article.toArticleResponse(author);
    console.log(articleData);
    console.log('checkpost 3');
    return res.status(200).json({ article: articleData });
  }
  catch (err) {
    console.log(err);
    return res.status(402).json({ msg: err });
  }
};
const searchPosts = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);
    const words = keyword.split(" "); // ["Acid", "properties"]
    const regexArray = words.map(word => ({
      title: { $regex: `.*${word}.*`, $options: "i" }
    }));
    console.log(regexArray);
    const posts = await Articles.find({
      $or: regexArray
    }).populate("author", "name image");

    res.status(200).json({
      count: posts.length,
      posts
    });
  }
  catch (error) {
    console.error(error);
    res.status(404).json(error);
  }
}
const getPosts = async (req, res) => {
  try {
    console.log(req.originalUrl);
    // console.log(req.query);
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await Articles.find().populate("author", "name image").skip((page - 1) * limit).limit(limit);
    const totalPosts = await Articles.countDocuments();
    // console.log(response);
    
    res.status(200).json({ 
      posts: response, 
      totalPages:(Math.ceil(totalPosts/limit)),
      hasMore: page * limit < totalPosts
    });
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err });
  }
}
const deletePost = async (req, res) => {
  try {
    const { _id } = req.body.data
    const newData = await Articles.findByIdAndDelete(_id);
    console.log("Post deleted successfully");
    return res.status(200).json({ msg: 'Post deleted successfully' });
  }
  catch (err) {
    return res.status(400).json({ msg: err });
  }
}

module.exports = { addArticle, getPosts, deletePost, searchPosts };
