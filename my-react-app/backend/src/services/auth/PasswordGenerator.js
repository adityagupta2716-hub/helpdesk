const crypto=require("crypto");

function generatePassword(length=12)
{
    const characters=
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

    let password="";

    const randomBytes=crypto.randomBytes(length);

    for(const byte of randomBytes)
    {
        password+=characters[
            byte % characters.length
        ];
    }

    return password;
}

module.exports={
    generatePassword
};