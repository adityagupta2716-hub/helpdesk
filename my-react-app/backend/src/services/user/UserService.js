const bcrypt=require("bcryptjs");

const User=require("../../models/User.js");

const {
    generatePassword
}=require("../auth/PasswordGenerator.js");

const NotificationService=require("../notification");
async function createUser({
    name,
    email,
    mobile,
    role,
    department={}
})
{
    const existingUser=await User.findOne({
        email
    });
    if(existingUser)
    {
        throw new Error(
            "User already exists."
        );
    }
    const temporaryPassword=generatePassword();

    const hashedPassword=await bcrypt.hash(temporaryPassword,10);
    const user=await User.create({
        name,
        email,
        mobile,
        password:hashedPassword,
        role,
        department:
        role==="staff"
        ?department
        :null,
        mustChangePassword:true
    });

    await NotificationService.notify({
        event:"account.created",
        userId:user._id,
        payload:{
            user:{
                id:user._id.toString(),
                name:user.name,
                email:user.email,
                role:user.role
            },
            temporaryPassword
        }
    });
    return {
        id:user._id,
        name:user.name,
        email:user.email,
        mobile:user.mobile,
        role:user.role,
        department:user.department
    };
}

module.exports={
    createUser
};