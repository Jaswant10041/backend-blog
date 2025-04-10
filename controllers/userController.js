const bcrypt=require('bcrypt');
const Users=require('../models/userModel');

const userLogin=async(req,res)=>{
    const data=req.body;
    const foundData=await Users.findOne({email:data.email});
    if(!foundData){
        res.status(404).json({
            errors:{
                body: "Account Not found",
            },
        });
        return ;
    }
    if(foundData){
        const isCorrectPassword=await bcrypt.compare(data.password,foundData.password);
        if(!isCorrectPassword){
            res.status(401).json({
                errors:{
                    body: "Incorrect Password",
                },
            });
            return ;
        }
        console.log(foundData);
        const dataWithToken=foundData.toUserResponse();
        // flag=true;
        res.status(201).json(dataWithToken);
    }
    else{
        res.status(422).json({
            errors:{
                body: "Unable to Login"
            }
        });
    }  
}
const userRegister=async(req,res)=>{
    try{
        const data=req.body;
        if(!data || !data.name || !data.email || !data.password){
            res.status(200).json({"msg":"Every field is required"});
        }
        //hashing a password
        const findEmail=await Users.findOne({email:data.email});
        if(findEmail){
            console.log("Already Registered");
            alert('Already registered');
            throw new Error("Already registered");
        }
        const hashedPassword=await bcrypt.hash(data.password,10);
        
        const temp={
            name:data.name,
            email:data.email,
            password:hashedPassword
        }
        
        const insertedData=await Users.create(temp);
        const dataWithToken=insertedData.toUserResponse();
        res.status(200).json(dataWithToken);
    }
    catch(err){
        res.status(409).json({'msg':"Already registered"})
    }
}   
const getCurrentUser=async(req,res)=>{
    const email=req.email;
    const user=await Users.findOne({email});
    if(!user){
        return res.status(404).json({message:"User Not Found"});
    }
    res.status(200).json(user.toUserResponse());
}
const ignore=(req,res)=>{
    return res.status(200).json({message:"Authentication successful"});
}
const updateUserData=async(req,res)=>{
    const data=req.body;
    console.log(data);
    const {email,name,oldPassword,newPassword}=data;
    const foundData=await Users.findOne({email});
    // console.log(foundData);
    const isCorrectPassword=await bcrypt.compare(oldPassword,foundData.password);
    if(!isCorrectPassword){
        res.status(401).json({
            errors:{
                body: "Incorrect Password",
            },
        });
        return ;
    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    const updatedData=await Users.findOneAndUpdate({email},{name:name,password:hashedPassword},{
        new:true
    });
    console.log(updatedData);
    res.status(200).json({data:updatedData})
}
module.exports={userLogin,userRegister,getCurrentUser,updateUserData,ignore};