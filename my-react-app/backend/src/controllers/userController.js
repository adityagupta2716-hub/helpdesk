const Notification = require("../models/Notification.js");
const User=require("../models/User.js");
const bcrypt=require("bcryptjs");
const {
    createUser:createUserService
}=require("../services/user/UserService.js");
const getProfile=async(req,res)=>{
    try{
        res.status(200).json(
            req.user
        );
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const updateProfile=async(req,res)=>{
    try{
        const{name,mobile}=req.body;
        const user=await User.findById(req.user._id);
        user.name=name||user.name;
        user.mobile=mobile||user.mobile;
        await user.save();
        res.status(200).json({
            message:"Profile updated successfully",
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
const changePassword=async(req,res)=>{
    try{
        const{
            currentPassword,
            newPassword
        }=req.body;
        const user=await User.findById(req.user._id).select("+password");
        const isMatch=await bcrypt.compare(currentPassword,user.password);
        if(!isMatch)
        {
            return res.status(400).json({
                message:"Current password is incorrect"
            });
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        await user.save();
        res.status(200).json({
            message:"Password changed successfully"
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const getStaffUsers=async(req,res)=>{
    try{
        let query={
            role:"staff",
            status:"active"
        };

        if(req.user.role==="staff")
        {
            query.department=req.user.department;
        }
        const staffUsers=await User.find(query).select("name email mobile role department status");
        res.status(200).json({
            count:staffUsers.length,
            staffUsers
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
}
const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find().select("name email mobile role department status createdAt");
        res.status(200).json({
            count:users.length,
            users
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const createUser=async(req,res)=>{
    try{
        const{
            name,
            email,
            mobile,
            password,
            role,
            department
        }=req.body;
        // const existingUser=await User.findOne({email});
        // if(existingUser)
        // {
        //     return res.status(400).json({
        //         message:"User already exists"
        //     });
        // }
        // const hashedPassword=await bcrypt.hash(password,10);
        const user=await createUserService({
            name,
            email,
            mobile,
            role,
            department
        });
        // const admins=await User.find({
        //     role:"admin"
        // });
        // for(const admin of admins)
        // {
        //     await Notification.create({
        //         user:admin._id,
        //         title:"New User Created",
        //         message:`${user.name} was added as ${user.role}`
        //     });
        // }
        // res.status(201).json({
        //     message:"User created successfully",
        //     user
        // });
        res.status(201).json({
            message:"User created successfully",
            user
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const updateUser=async(req,res)=>{
    try
    {
        const{
            name,
            email,
            mobile,
            role,
            department
        }=req.body;
        const user=await User.findById(req.params.id);
        if(!user)
        {
            return res.status(404).json({
                message:"User not found"
            });
        }
        user.name=name;
        user.email=email;
        user.mobile=mobile;
        user.role=role;
        user.department=role==="staff"?department:null;
        await user.save();
        res.status(200).json({
            message:"User updated successfully",
            user
        });

    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports={
    getProfile,
    updateProfile,
    changePassword,
    getStaffUsers,
    getAllUsers,
    createUser,
    updateUser
};