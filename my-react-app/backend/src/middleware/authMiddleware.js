const jwt=require("jsonwebtoken");
const User=require("../models/User");
const {
    verifyToken
}=require("../utils/verifyToken.js");
const protect=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        )
        {
            return res.status(401).json({
                message:"No token provided"
            });
        }
        const token=authHeader.split(" ")[1];
        req.user=await verifyToken(token);
        next();

    }
    catch(error)
    {
        res.status(401).json({
            message:"Not authorized"
        });
    }
};
const authorize=(...roles)=>{
    return(req,res,next)=>{
        if(
            !roles.includes(req.user.role)
        )
        {
            return res.status(403).json({
                message:"Access denied"
            });
        }
        next();
    };
}
module.exports={
    protect,
    authorize 
};