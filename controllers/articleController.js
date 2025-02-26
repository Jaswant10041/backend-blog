const { response } = require("express");
const Articles = require("../models/articleModel");
const Users = require("../models/userModel");
const addArticle = async (req, res) => {
  try{
    const email = req.email;
    const author = await Users.findOne({ email });
  
    const id = author._id;
    const { title, description, body, tags } = req.body.data;
    if (!title || !description || !body) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log('checkpost 1');
    const article = await Articles.create({ title, description, body });
    article.author = id;
    if (Array.isArray(tags) && tags.length > 0) {
      article.tags = tags;
    }
    console.log('checkpost 2');
    await article.save();
    const articleData = await article.toArticleResponse(author);
    console.log(articleData);
    console.log('checkpost 3');
    return res.status(200).json({ article: articleData });
  }
  catch(err){
    console.log(err);
    return res.status(402).json({msg:err});
  }
};
const getPosts=async(req,res)=>{
  try{
    const response=await Articles.find();
    
    res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    return res.status(400).json({msg:err});
  }
}
const deletePost=async(req,res)=>{
  try{
    const {_id}=req.body.data
    const newData=await Articles.findByIdAndDelete(_id);
    console.log("Post deleted successfully");
    return res.status(200).json({msg:'Post deleted successfully'});
  }
  catch(err){
    return res.status(400).json({msg:err});
  }
}
module.exports = { addArticle,getPosts,deletePost };
