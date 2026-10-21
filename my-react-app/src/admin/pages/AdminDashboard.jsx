import AdminLayout from "../components/layout/AdminLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
//import {adminDashboardStats} from "../data/adminDashboardStats.js";
import AdminRecentTickets from "../components/dashboard/AdminRecentTickets.jsx";
import DepartmentTickets from "../components/dashboard/DepartmentTickets.jsx";
import DonutChart from "../components/dashboard/DonutChart.jsx";
import TicketsOverviewChart from "../components/dashboard/TicketOverviewChart.jsx";
import {
    ticketsByCategoryData
} from "../data/ticketsByCategoryData.js";
import{
    useDispatch,
    useSelector
} from "react-redux";
import {fetchAdminDashboard} from "../../features/dashboard/dashboardSlice.js";
import { useEffect } from "react";
function AdminDashboard(){
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(fetchAdminDashboard());
    },[
        dispatch
    ]);
    const{
        dashboardData,
        loading,
        error
    }=useSelector(state=>state.dashboard);

    const stats=[
        {
            title:"Total Tickets",
            value:dashboardData?.totalTickets || 0
        },
        {
            title:"Open Tickets",
            value:dashboardData?.openTickets || 0
        },
        {
            title:"Students",
            value:dashboardData?.totalStudents || 0
        },
        {
            title:"Staff",
            value:dashboardData?.totalStaff || 0
        }
    ];
    const categoryChartData=dashboardData?.categoryStats?.map(category=>({
        name:category._id,
        value:category.value
    })) || [];

    if(loading){
        return(
            <AdminLayout>
                Loading Dashboard...
            </AdminLayout>
        );
    }
    if(error){
        return(
            <AdminLayout>
                {error}
            </AdminLayout>
        );
    }
    return(
        <AdminLayout >
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-4 mt-8">
                {stats.map((stat)=>(
                    <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}/>
                    ))}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8">
                <TicketsOverviewChart data={dashboardData?.ticketOverview || []} />
                <DonutChart title="Tickets By Category" data={categoryChartData} />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="col-span-2">
                    <AdminRecentTickets
                    tickets={dashboardData?.recentTickets || []} />
                </div>
                <div className="col-span-1">
                    <DepartmentTickets 
                    departments={dashboardData?.departmentStats || []} />
                </div>
            </div>

        
        </AdminLayout>

    );
}
export default AdminDashboard;