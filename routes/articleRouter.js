const articleController = require('../controllers/articleController');
const verifyJWT = require('../middleware/verifyJWT');

const articleRouter=require('express').Router();

articleRouter.post('/add',verifyJWT,articleController.addArticle);
articleRouter.get('/posts',verifyJWT,articleController.getPosts);
articleRouter.post('/deletepost',verifyJWT,articleController.deletePost);

module.exports=articleRouter;