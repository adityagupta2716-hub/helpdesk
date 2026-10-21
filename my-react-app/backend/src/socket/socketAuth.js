const {
    verifyToken
}=require("../utils/verifyToken.js");

function registerSocketAuth(io)
{
    io.use(async(socket,next)=>{

        try
        {
            const token=
                socket.handshake.auth?.token;

            const user=
                await verifyToken(token);

            socket.user=user;

            next();
        }
        catch(error)
        {
            next(
                new Error("Authentication failed.")
            );
        }

    });
}

module.exports={
    registerSocketAuth
};