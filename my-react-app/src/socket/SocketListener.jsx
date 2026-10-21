import { useEffect } from "react";

import { useDispatch } from "react-redux";

import {

    onSocketReady

} from "./SocketClient";

import {

    receiveNotification

} from "../features/notifications/notificationSlice";

function SocketListener()
{
    const dispatch=useDispatch();

    useEffect(()=>{

        onSocketReady(socket=>{

            socket.on(
                "notification",
                notification=>{

                    dispatch(
                        receiveNotification(
                            notification
                        )
                    );

                }
            );

        });

    },[
        dispatch
    ]);

    return null;
}

export default SocketListener;