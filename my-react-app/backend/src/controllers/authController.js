const bcrypt=require("bcryptjs");
const User=require("../models/User");
const generateToken=require("../utils/generateToken");
const registerUser=async(req,res)=>{
    try{
        const{name,email,mobile,password,role}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                message:"User already exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            mobile,
            password:hashedPassword,
            role
        });
        res.status(201).json({
            message:"User registered sucessfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                mobile:user.mobile,
                role:user.role
            }
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user)
        {
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const token=generateToken(user._id,user.role);
        res.status(200).json({
            message:"Login sucessful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports={
    registerUser,
    loginUser
};
