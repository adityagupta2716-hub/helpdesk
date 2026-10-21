import Topbar from "../../../components/common/Topbar.jsx";
import StaffSidebar from "./StaffSidebar.jsx";
import { useSelector } from "react-redux";
function StaffLayout({children})
{
    const {user}=useSelector(state=>state.auth)
    return(
        <div className="flex">
            <StaffSidebar/>
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
export default StaffLayout;