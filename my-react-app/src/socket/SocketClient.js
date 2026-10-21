import { io } from "socket.io-client";

let socket = null;

const listeners = [];

export function connectSocket(token)
{
    if(socket)
    {
        return socket;
    }

    socket = io("http://localhost:5000",{

        auth:{
            token
        },

        autoConnect:true

    });

    socket.on("connect",()=>{

        console.log(
            "Socket connected:",
            socket.id
        );

        listeners.forEach(listener=>
            listener(socket)
        );

    });

    socket.on("disconnect",()=>{

        console.log(
            "Socket disconnected."
        );

    });

    return socket;
}

export function getSocket()
{
    return socket;
}

export function onSocketReady(listener)
{
    if(socket?.connected)
    {
        listener(socket);
        return;
    }

    listeners.push(listener);
}

export function disconnectSocket()
{
    if(socket)
    {
        socket.disconnect();

        socket=null;
    }
}

export function joinTicket(ticketId)
{
    socket?.emit(
        "joinTicket",
        ticketId
    );
}

export function leaveTicket(ticketId)
{
    socket?.emit(
        "leaveTicket",
        ticketId
    );
}