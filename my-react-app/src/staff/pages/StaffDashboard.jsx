import StaffLayout from "../components/layout/StaffLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DonutChart from "../../admin/components/dashboard/DonutChart.jsx";
import RecentActivity from "../components/dashboard/RecentActivity.jsx";
import { staffPerformanceStats } from "../data/staffDashboardMetrics.js";
import {
    useDispatch,
    useSelector
} from "react-redux";
import { useEffect } from "react";
import { fetchStaffDashboard } from "../../features/dashboard/dashboardSlice.js";
function StaffDashboard(){
    const dispatch=useDispatch();
    const{
        dashboardData,
        loading,
        error
    }=useSelector(state=>state.dashboard);
    console.log(dashboardData);
    const activities=dashboardData?.recentAssignedTickets?.map(
        (ticket)=>({
            id:ticket._id,
            message:`${ticket.title} (${ticket.status})`,
            time: new Date(ticket.createdAt).toLocaleDateString()
        })
    ) || [];
    const {user}=useSelector(state=>state.auth);
    useEffect(()=>{
        dispatch(fetchStaffDashboard());
    },[
        dispatch
    ]);
    if(loading)
    {
        return(
            <StaffLayout>
                Loading...
            </StaffLayout>
        );
    }
    const chartData=[
        {
            name:"Open",
            value:dashboardData?.openTickets || 0
        },
        {
            name:"In Progress",
            value:dashboardData?.inProgressTickets || 0
        },
        {
            name:"Resolved",
            value:dashboardData?.resolvedTickets || 0
        }
    ]
    return(
        <StaffLayout>
            <h1 className="text-3xl font-bold">
                Staff Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
                Welcome back, {user?.name || ""}
            </p>
            <div className="grid grid-cols-5 gap-4 mt-6">
            {
                [
                    {
                        title:"Assigned To Me",
                        value:dashboardData?.totalAssigned || 0
                    },
                    {
                        title:"Open",
                        value:dashboardData?.openTickets || 0
                    },
                    {
                        title:"In Progress",
                        value:dashboardData?.inProgressTickets || 0
                    },
                    {
                        title:"Resolved Today",
                        value:dashboardData?.resolvedToday || 0
                    },
                    {
                        title:"Overdue",
                        value:dashboardData?.overdueTickets || 0
                    }
                ].map(stat=>(
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))
            }
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <DonutChart title="My Assigned Tickets" data={chartData}/>
                <RecentActivity activities={activities} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
                {
                [
                    {
                        title:"Resolved This Week",
                        value:dashboardData?.resolvedThisWeek || 0
                    },
                    {
                        title:"Pending Response",
                        value:dashboardData?.pendingResponse || 0
                    },
                    {
                        title:"Documented Resolutions",
                        value:dashboardData?.documentedResolutions || 0
                    }
                ].map(stat=>(
                    <StatCard 
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    />
                ))}

            </div>
        </StaffLayout>
    );
}
export default StaffDashboard;