
const mongoose=require('mongoose');
const Users=require('../models/userModel');
const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to database");
    }
    catch(err){
        console.log("Error while connecting to database",err);
    }
}
module.exports=dbConnect;