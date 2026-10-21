import StaffLayout from "../components/layout/StaffLayout";
import NotificationCard from "../../components/common/notifications/NotificationCard";
//import { staffNotifications as initialNotifications } from "../data/staffNotifications";
import {useState, useEffect} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    fetchNotifications,
    markAsRead
} from "../../features/notifications/notificationSlice.js";
function StaffNotifications(){
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
    //const[notifications,setNotifications]=useState(initialNotifications);
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
        notification=>!notification.read
    )
    :notifications.filter(
        notification=>notification.type===activeTab
    );
    function markAsRead(id)
    {
        setNotifications(notifications.map(notification=>
            notification._id===id?
            {
                ...notification,read:true
            }
            :notification
        ));
    }
    function markAllAsRead(){
        setNotifications(notifications.map(notification=>(
            {
                ...notification,read:true
            }
        )));
    }
    return(
        <StaffLayout >
        <h1 className="text-3xl font-bold">
            Notifications
        </h1>
        <p className="text-gray-500 mt-2">
            Stay updated with system activities
        </p>
        <div className="flex gap-4 mt-8">
            {tabs.map(tab=>(
                <button key={tab}
                onClick={()=>setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg transition ${
                    activeTab===tab?"bg-blue-600 text-white"
                    :"bg-white hover:bg-gray-100"
                }`}>
                    {tab}
                </button>
            ))}
            <div>
                <button
                onClick={markAllAsRead}
                className="bg-blue-600 text-white hover:underline px-5 py-2 rounded-lg">
                    Mark all as read
                </button>
            </div>
        </div>
        <div className="mt-6 space-y-4">
            {filteredNotifications.map(
                notification=>(
                    <NotificationCard
                    key={notification._id}
                    title={notification.title}
                    message={notification.message}
                    read={notification.read}
                    onClick={()=>
                        markAsRead(notification._id)
                    }
                    />
                )
            )}
        </div>
        </StaffLayout>

    );
}
export default StaffNotifications;