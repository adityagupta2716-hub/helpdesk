import Sidebar from "./Sidebar.jsx";
import Topbar from "../common/Topbar.jsx";
import {useSelector} from "react-redux"
function DashboardLayout({children})
{
    const {user}=useSelector(state=>state.auth);
    return(
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 bg-gray-100 min-h-screen p-6">
                <Topbar 
                role={user?.role}
                userName={user?.name}
                userRole={user?.role}
                />
                {children}
            </main>
        </div>
    );
}
export default DashboardLayout;