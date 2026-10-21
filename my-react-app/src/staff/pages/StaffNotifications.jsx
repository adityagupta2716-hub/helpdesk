import StaffLayout from "../components/layout/StaffLayout.jsx";
import NotificationCard from "../../components/common/notifications/NotificationCard.jsx";
import {useState,useEffect} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    fetchNotifications,
    markAsRead,
    markAllAsReadThunk
} from "../../features/notifications/notificationSlice.js";
function Notifications(){
    const dispatch=useDispatch();
    const {
        notifications,
        loading,
        error
    }=useSelector(state=>state.notifications);
    useEffect(()=>{
        dispatch(fetchNotifications());
    },[
        dispatch
    ]);
    const[activeTab,setActiveTab]=useState("All");
        const tabs=[
            "All",
            "Unread",
            "Updates"
        ];
        const filteredNotifications= 
        activeTab==="All"
        ?notifications
        :activeTab==="Unread"
        ?notifications.filter(
            notification=>!notification.isRead
        )
        :notifications;
    const handleMarkAsRead=(id,isRead)=>{
        if(isRead)
        {
            return;
        }
        dispatch(markAsRead(id));
    };
    const handleMarkAllAsRead=()=>{
            dispatch(markAllAsReadThunk());
    };
    if(loading)
    {
        return(
            <StaffLayout>
                <h1>
                    Loading Notifications...
                </h1>
            </StaffLayout>
        )
    }
    if(error)
    {
        return(
            <StaffLayout>
            <h1 className="text-red-500">
                {error}
            </h1>
            </StaffLayout>
        );
    }
    return(
        <StaffLayout>
            <h1 className="text-3xl font-bold">
                Notifications
            </h1>
            <p className="text-gray-500 mt-2">
                Stay updated with your tickets and announcements.
            </p>
            <div className="flex gap-4 mt-8">
                {tabs.map((tab)=>(
                    <button
                    key={tab}
                    onClick={()=>setActiveTab(tab)}
                    className={`px-5 py-2 rounded-lg whitespace-nowrap transition ${activeTab===tab?
                    "bg-blue-600 text-white":"bg-white hover:bg-gray-100"}`}>
                        {tab}
                    </button>
                ))}
                {notifications.some(notification=>!notification.isRead) && (
                <div>
                <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 text-white hover:underline px-5 py-2 rounded-lg">
                    Mark all as read
                </button>
                </div>
                ) }
            </div>

            <div className="mt-8 space-y-4 max-h-[650px] overflow-y-auto pr-2">
                {
                    filteredNotifications.length===0?
                    (
                        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                            No Notifications found.
                        </div>
                    ):
                    (
                        filteredNotifications.map((notification)=>(
                            <NotificationCard key={notification._id}
                            title={notification.title}
                            message={notification.message}
                            read={notification.isRead}
                            createdAt={notification.createdAt}
                            onClick={()=>handleMarkAsRead(notification._id,notification.isRead)}/>
                        ))
                    )
                }
            </div>
        </StaffLayout>
    );
}
export default Notifications;