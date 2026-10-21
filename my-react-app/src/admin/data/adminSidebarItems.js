import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaTicketAlt,
  FaBook,
  FaChartBar,
  FaBell,
  FaCog,
  FaUser,
  FaRobot
} from "react-icons/fa";

export const adminSidebarItems=[
    {
        name: "Dashboard",
        icon: FaHome,
        path: "/admin/dashboard"

    },
    {
        name: "Users",
        icon: FaUsers,
        path: "/admin/users"

    },
    {
        name: "Departments",
        icon: FaBuilding,
        path: "/admin/departments"

    },
    {
        name: "Tickets",
        icon: FaTicketAlt,
        path: "/admin/tickets"

    },
    {
        name:"AI Assitant",
        icon:FaRobot,
        path:"/admin/assistant"
    },
    {
        name: "Knowledge Base",
        icon: FaBook,
        path: "/admin/knowledge-base"

    },
    {
        name: "Reports",
        icon: FaChartBar,
        path: "/admin/reports"
    },
    {
        name: "Notifications",
        icon: FaBell,
        path: "/admin/notifications"
    },
    {
        name: "Settings",
        icon: FaCog,
        path: "/admin/settings"
    },
    {
        name: "Profile",
        icon: FaUser,
        path: "/admin/profile"
    }
]