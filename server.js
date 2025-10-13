require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./models/corsOptions");
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const Users=require('./models/userModel');

const Message=require('./models/MessageModel');
// const {Server}=require('socket.io')
const {Server} =require('socket.io');
const http=require('http');
const server=http.createServer(app);
// const io=new Server(s)

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
const DbConnect = require("./config/dbConnect");
DbConnect();
//users
app.use("/api", require("./routes/userRouter"));
//articles
app.use("/api/articles", require("./routes/articleRouter"));
app.use("/api/articles/comments", require("./routes/commentRouter"));
app.use('/api/messages',require('./routes/messageRouter'))

//socket logic
const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  },
});
const users=new Map();
io.on("connection",(socket)=>{
  console.log("User connected: ",socket.id);
  socket.on("join",async(token)=>{
    try{
      console.log(token);
      const user=jwt.verify(token,process.env.ACCESS_TOKEN);
      console.log(user);
      const userData=await Users.findOne({email:user?.user?.email}).select('_id');
      console.log(userData);
      users.set(userData._id,socket.id);
      console.log(`${userData._id} joined with socket ${socket.id}`);
    }
    catch(err){
      console.log("Invalid token",err);
    }
  });
  socket.on("sendMessage",async({senderId,receiverId,text})=>{
    try{
      const message=new Message({senderId,receiverId,text});
      await message.save();
      const receiverSocket=users.get(receiverId);
      if(receiverSocket){
        io.to(receiverSocket).emit("receiveMessage",{
          senderId,
          text,
          createdAt:message.createdAt,
        });
      }
      io.to(users.get(senderId)).emit("messageSaved",{
        ...message._doc,
      });
    }
    catch(err){
      console.error("Error saving message: ",err);
    }
  })
  socket.on("disconnect",()=>{
    for(let [id,sId] of users.entries()){
      if(sId===socket.id) users.delete(id);
    }
  })
});


mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log("Error while connecting to MongoDB: ", err);
});
