const {Server}=require("socket.io");

let io=null;

function initialize(server)
{
    io=new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    });
    return io;
}

function getIO()
{
    if(!io)
    {
        throw new Error(
            "Socket.IO has not been initialized."
        );
    }
    return io;
}

module.exports={
    initialize,
    getIO
};