import {Link, useLocation, useNavigate} from "react-router-dom";
import { adminSidebarItems } from "../../data/adminSidebarItems";
import {logout} from "../../../features/auth/authSlice.js";
import {clearChatState } from "../../../features/chatbot/chatbotSlice.js";
import { useDispatch } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
function AdminSidebar(){
    const location=useLocation();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    function handleLogout()
    {
        const confirmLogout=
        window.confirm("Are you sure you want to logout?");
        if(!confirmLogout)
        {
            return;
        }
        dispatch(clearChatState());
        dispatch(logout());
        navigate("/");
    }
    return(
        <div className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-blue-800">
                <h1 className="text-xl font-bold">
                    AI Campus Helpdesk
                </h1>
                <p className="text-xs text-blue-300 mt-1">
                    Admin Portal
                </p>
            </div>
            <nav className="mt-4 flex-1">
                {adminSidebarItems.map((item)=>{
                    const Icon=item.icon;
                    return(
                        <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition
                        ${
                            location.pathname===item.path
                            ?"bg-blue-700"
                            :"hover:bg-blue-800"
                        }`}>
                            <Icon size={18} />
                            <span> 
                                {item.name}
                            </span>
                        </Link>
                    );

                })}
            </nav>
            <div className="p-4 border-t border-blue-800">
                <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
                    <FaSignOutAlt size={18}/>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
export default AdminSidebar;