const {
    initialize
}=require("./SocketService");

const {
    registerSocketAuth
}=require("./socketAuth");

function initializeSockets(server)
{
    const io=initialize(server);

    registerSocketAuth(io);

    io.on("connection",(socket)=>{

        console.log(
            `${socket.user.name} connected.`
        );

        socket.join(
            socket.user._id.toString()
        );

        socket.on("joinTicket",(ticketId)=>{
            const room=`ticket:${ticketId}`;
            socket.join(room);

            console.log(
                `${socket.user.name} joined ${room}`
            );
        });

        socket.on("leaveTicket",(ticketId)=>{
            const room=`ticket:${ticketId}`;
            socket.leave(room);
            console.log(
                `${socket.user.name} left ${room}`
            );
        });

        console.log(
            `Joined room: ${socket.user._id}`
        );

        socket.on("disconnect",()=>{

            console.log(
                `${socket.user.name} disconnected.`
            );

        });

    });

    return io;
}

module.exports={
    initializeSockets
};