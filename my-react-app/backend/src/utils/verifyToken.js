const jwt=require("jsonwebtoken");
const User=require("../models/User.js");

async function verifyToken(token)
{
    if(!token)
    {
        throw new Error("No token provided.");
    }

    const decoded=jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user=await User.findById(decoded.id);

    if(!user)
    {
        throw new Error(
            "User no longer exists."
        );
    }

    return user;
}

module.exports={
    verifyToken
};