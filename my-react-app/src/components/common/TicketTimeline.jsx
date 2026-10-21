import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeline } from "../../features/timeline/timelineSlice";

import {
    onSocketReady
} from "../../socket/SocketClient";

function TicketTimeline({ticketId}){
    const dispatch=useDispatch();
    const{
        timeline,
        loading
    }=useSelector(state=>state.timeline);

    useEffect(()=>{
        dispatch(fetchTimeline(ticketId));
    },[
        dispatch,
        ticketId
    ]);

    useEffect(()=>{
        let socketInstance=null;
        onSocketReady(socket=>{
            socketInstance=socket;
            const handleTimelineUpdated=({
                ticketId:updatedTicketId
            })=>{
                if(updatedTicketId!==ticketId)
                {
                    return;
                }

                dispatch(
                    fetchTimeline(ticketId)
                );
            };

            socket.on(
                "timelineUpdated",
                handleTimelineUpdated
            );
        });

        return ()=>{
            if(socketInstance)
            {
                socketInstance.off(
                    "timelineUpdated"
                );
            }
        };
    },[
        dispatch,
        ticketId
    ]);

    useEffect(()=>{
        let socketInstance=null;

        onSocketReady(socket=>{
            socketInstance=socket;

            const handleTimelineUpdated=({
                ticketId:updatedTicketId
            })=>{
                if(updatedTicketId!==ticketId)
                {
                    return;
                }

                dispatch(fetchTimeline(ticketId));
            };

            socket.on(
                "timelineUpdated",
                handleTimelineUpdated
            );
        });

        return ()=>{
            if(socketInstance)
            {
                socketInstance.off(
                    "timelineUpdated"
                );
            }
        }
    },[
        dispatch,
        ticketId
    ]);

    const getEventColor=(eventType)=>{
        switch(eventType)
        {
            case "created":return "bg-blue-500";
            case "assigned":return "bg-purple-500";
            case "status":return "bg-orange-500";
            case "resolution":return "bg-green-500";
            case "closed":return "bg-gray-500";
            case "canceled":return "bg-gray-700";
            case "updated":return "bg-blue-700";
            default:return "bg-blue-500";
        }
    };
    console.log("Timeline", timeline);
    return(
        <div className="bg-white rounded-xl shadow p-6 h-[650px]">
            <h2 className="text-xl font-semibold mb-6">
                Ticket Timeline
            </h2>
            <div className="relative overflow-y-auto h-[560px] pr-2">
                {timeline.map((event,index)=>(
                    <div key={event._id} className="relative pl-8 pb-8">
                        {index !==timeline.length -1 && (
                            <div 
                            className="absolute left-3 top-3 w-0.5 h-full bg-gray-300"
                            />
                        )}
                        <div 
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full ${getEventColor(event.eventType)}`}
                        />
                        <div>
                            <h3 className="font-semibold">
                                {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                {event.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date (event.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                        day:"numeric",
                                        month:"short",
                                        hour:"numeric",
                                        minute:"2-digit"
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}
export default TicketTimeline;