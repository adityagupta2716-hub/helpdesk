import AdminLayout from "../components/layout/AdminLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportsCharts from "../components/reports/ReportsCharts.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminDashboard } from "../../features/dashboard/dashboardSlice.js";
//import {ticketTrendData,reportStats,categoryData,resolutionData} from "../data/reportsData.js"; 
function AdminReports(){
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
    }=useSelector(state=>state.dashboard)
    const reportStats=[
        {
            title:"Total Tickets",
            value:dashboardData?.totalTickets || 0
        },
        {
            title:"Open Tickets",
            value:dashboardData?.openTickets || 0
        },
        {
            title:"Closed Tickets",
            value:dashboardData?.closedTickets || 0
        },
        {
            title:"Total Users",
            value:dashboardData?.totalUsers || 0
        }
    ];
    const categoryData=(dashboardData?.categoryStats || [])
    .map(item=>({
        name:item._id,
        value:item.value
    }));
    const resolutionData=(dashboardData?.statusStats || [])
    .map(
        item=>({
            range:item._id,
            tickets:item.value
        })
    );
    console.log(resolutionData);
    const ticketTrendData=dashboardData?.ticketOverview || [];
    if(loading)
    {
        return(
            <AdminLayout>
                Loading Reports...
            </AdminLayout>
        );
    }
    if(error)
    {
        return(
            <AdminLayout>
                {error}
            </AdminLayout>
        );
    }
    return(
        <AdminLayout >
        <h1 className="text-3xl font-bold">
            Reports & Analytics
        </h1>
        <div className="grid grid-cols-4 gap-4 mt-6">
            {reportStats.map(stat=>(
                <StatCard 
                key={stat.title}
                title={stat.title}
                value={stat.value}
                />
            ))}
        </div>
        <ReportsCharts
        ticketTrendData={ticketTrendData}
        categoryData={categoryData}
        resolutionData={resolutionData}
        />
        </AdminLayout>

    );
}
export default AdminReports;