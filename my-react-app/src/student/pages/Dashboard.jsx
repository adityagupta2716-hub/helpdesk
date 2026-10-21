import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import RecentTickets from "../../components/dashboard/RecentTickets.jsx";
import QuickActions from "../../components/dashboard/QuickActions.jsx";
import HelpCard from "../../components/dashboard/HelpCard.jsx";
import {useEffect} from "react";
import{
    useDispatch,
    useSelector
} from "react-redux";
import {
    fetchStudentDashboard
} from "../../features/dashboard/dashboardSlice.js";
function Dashboard(){
    const dispatch=useDispatch();
    const{
        dashboardData,
        loading,
        error
    }=useSelector(state=>state.dashboard);
    const {user}=useSelector(state=>state.auth);
    useEffect(()=>{
        dispatch(fetchStudentDashboard());},
        [dispatch]);
    console.log(dashboardData);
    return(
        <DashboardLayout>
            <h1 className="text-3xl font-bold">
                Welcome, {user?.name || ""}
            </h1>
            <p className="text-gray-600 mt-2">
                Here's what's happening with your tickets.
            </p>
            <div className="grid grid-cols-4 gap-4 mt-8">
                <StatCard
                title="Total Tickets"
                value={dashboardData?.totalTickets || 0}
                />
                <StatCard
                title="Open Tickets"
                value={dashboardData?.openTickets || 0}
                />
                <StatCard
                title="In Progress"
                value={dashboardData?.inProgressTickets || 0}
                />
                <StatCard
                title="Closed Tickets"
                value={dashboardData?.closedTickets || 0}
                />
            </div>
            <div className="grid grid-cols-12 gap-6 mt-8">
                <div className="col-span-8">
                    <RecentTickets tickets={dashboardData?.recentTickets || []} />
                </div>
                <div className="col-span-4">
                    <QuickActions />
                    <HelpCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
export default Dashboard;