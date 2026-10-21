import {
    FaHome,
    FaTicketAlt,
    FaBook,
    FaBell,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

export const staffSidebarItems = [
    {
        name: "Dashboard",
        icon: FaHome,
        path: "/staff/dashboard"
    },
    {
        name: "My Assigned Tickets",
        icon: FaTicketAlt,
        path: "/staff/tickets"
    },
    {
        name: "Knowledge Base",
        icon: FaBook,
        path: "/staff/knowledge-base"
    },
    {
        name: "Notifications",
        icon: FaBell,
        path: "/staff/notifications"
    },
    {
        name: "Profile",
        icon: FaUser,
        path: "/staff/profile"
    }
];