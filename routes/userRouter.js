const userRouter=require('express').Router();
const userController=require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

userRouter.post('/users/register',userController.userRegister);
userRouter.post('/users/login',userController.userLogin);
userRouter.get('/users/user',verifyJWT, userController.getCurrentUser);
userRouter.put('/users/update',userController.updateUserData);
userRouter.get('/users/isauthenticated',verifyJWT,userController.ignore);
module.exports=userRouter;