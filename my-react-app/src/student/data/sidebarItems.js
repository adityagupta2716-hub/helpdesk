import{
    FaHome,
    FaTicketAlt,
    FaPlusCircle,
    FaRobot,
    FaBell,
    FaUser,
} from "react-icons/fa";
// import {FaHome} from "react-icons/fa/FaHome";
// import FaTicketAlt from "react-icons/fa/FaTicketAlt";
// import FaPlusCircle from "react-icons/fa/FaPlusCircle";
// import FaRobot from "react-icons/fa/FaRobot";
// import FaBell from "react-icons/fa/FaBell";
// import FaUser from "react-icons/fa/FaUser";


export const sidebarItems=[
    {
        name:"Dashboard",
        path:"/student/dashboard",
        icon: FaHome
    },
    {
        name:"My Tickets",
        path:"/student/tickets",
        icon: FaTicketAlt
    },
    {
        name: "Create Ticket",
        path:"/student/create-ticket",
        icon: FaPlusCircle
    },
    {
        name:"AI Assistant",
        path:"/student/assistant",
        icon: FaRobot
    },
    {
        name:"Notifcations",
        path:"/student/notifications",
        icon: FaBell
    },
    {
        name:"Profile",
        path:"/student/profile",
        icon: FaUser
    }
]