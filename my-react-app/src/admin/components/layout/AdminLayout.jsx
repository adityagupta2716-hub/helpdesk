import Topbar from "../../../components/common/Topbar.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import { useSelector } from "react-redux";
function AdminLayout({children})
{
    const {user}=useSelector(state=>state.auth);
    return(
        <div className="flex">
            <AdminSidebar/>
            <main className="flex-1 bg-gray-100 min-h-screen p-6">
                <Topbar 
                role={user?.role || "admin"}
                userName={user?.name || "Admin"}
                userRole={user?.role || "admin"}/>
                {children}
            </main>
        </div>
    );
}
export default AdminLayout;