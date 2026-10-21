const Ticket=require("../models/Ticket");
const User=require("../models/User");
const{
    getDashboardMetrics
}=require("../services/dashboard/DashboardService.js");
const getStudentDashboard=async(req,res)=>{
    try{
        const totalTickets=await Ticket.countDocuments({
            createdBy:req.user._id
        });
        const openTickets=await Ticket.countDocuments({
            createdBy:req.user._id,
            status:"Open"
        });
        const inProgressTickets=await Ticket.countDocuments({
            createdBy:req.user._id,
            status:"In Progress"
        });
        const closedTickets=await Ticket.countDocuments({
            createdBy:req.user._id,
            status:"Closed"
        });
        const recentTickets=await Ticket.find({
            createdBy:req.user._id
        }).sort({createdAt:-1}).limit(5);
        res.status(200).json({
            totalTickets,
            openTickets,
            inProgressTickets,
            closedTickets,
            recentTickets
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
    
};
const getStaffDashboard=async(req,res)=>{
    try{
        const today=new Date();
        today.setHours(0,0,0,0);
        const threeDaysAgo=new Date();
        threeDaysAgo.setDate(
            threeDaysAgo.getDate()-3
        );
        const weekAgo=new Date();
        weekAgo.setDate(weekAgo.getDate()-7);
        const [
            totalAssigned,
            openTickets,
            inProgressTickets,
            resolvedToday,
            overdueTickets,
            resolvedThisWeek,
            pendingResponse,
            documentedResponse,
            resolvedTickets
        ] = await Promise.all([
            Ticket.countDocuments({
            assignedTo:req.user._id}),

            Ticket.countDocuments({
            assignedTo:req.user._id,
            status:"Open"}),

            Ticket.countDocuments({
            assignedTo:req.user._id,
            status:"In Progress"}),

            Ticket.countDocuments({
            assignedTo:req.user._id,
            status:"Resolved",
            resolvedAt:{ $gte:today}}),

            Ticket.countDocuments({
            assignedTo:req.user._id,
            status:{
                $nin:["Resolved","Closed"]
            },
            createdAt:{$lt:threeDaysAgo}}),

            Ticket.countDocuments({
                assignedTo:req.user._id,
                status:"Resolved",
                resolvedAt:{$gte:weekAgo}
            }),

            Ticket.countDocuments({
                assignedTo:req.user._id,
                status:"Assigned"
            }),

            Ticket.countDocuments({
                assignedTo:req.user._id,
                status:"Resolved",
                resolutionNotes:{
                    $exists:true,
                    $ne:""
                }
            }),

            Ticket.countDocuments({
                assignedTo:req.user._id,
                status:"Resolved"
            })
        ]);

        const recentAssignedTickets=await Ticket.find({
            assignedTo:req.user._id
        }).sort({createdAt:-1}).limit(5);

        res.status(200).json({
            totalAssigned,
            openTickets,
            inProgressTickets,
            resolvedToday,
            overdueTickets,
            recentAssignedTickets,
            resolvedThisWeek,
            pendingResponse,
            documentedResponse,
            resolvedTickets
        });

    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const getAdminDashboard=async(req,res)=>{
    try{
    //     const today=new Date();
    //     today.setHours(0,0,0,0);
    //     const resolvedToday=
    //     await Ticket.countDocuments({
    //         resolvedAt:{$gte:today}
    //     });
    //     const[
    //         totalTickets,
    //         openTickets,
    //         inProgressTickets,
    //         resolvedTickets,
    //     ]=await Promise.all([
    //         Ticket.countDocuments(),
    //         Ticket.countDocuments({status:"Open"}),
    //         Ticket.countDocuments({status:"In Progress"}),
    //         Ticket.countDocuments({status:"Resolved"})
    //     ]);
    //     const[
    //         totalStudents,
    //         totalStaff,
    //         totalUsers
    //     ]=await Promise.all([
    //         User.countDocuments({role:"student"}),
    //         User.countDocuments({role:"staff"}),
    //         User.countDocuments()
    //     ]);
    //     const recentTickets=await Ticket.find()
    //     .populate("createdBy","name email")
    //     .sort({createdAt:-1}).limit(5);

    //     const departmentStats=await Ticket.aggregate([
    //         {
    //             $group:{
    //                 _id:"$department",
    //                 count:{
    //                     $sum:1
    //                 }
    //             }
    //         }
    //     ]);
    //     const categoryStats=await Ticket.aggregate([
    //         {
    //             $group:{
    //                 _id:"$category",
    //                 value:{$sum:1}
    //             }
    //         }
    //     ]);
    //     const ticketOverview=await Ticket.aggregate([
    //         {
    //             $group:{
    //                 _id:{
    //                     date:{
    //                         $dateToString:{
    //                             format:"%Y-%m-%d",
    //                             date:"$createdAt"
    //                         }
    //                     },
    //                     status:"$status"
    //                 },
    //                 count:{
    //                     $sum:1
    //                 }
    //             }
    //         },
    //         {
    //             $sort:{
    //                 "_id.date":1
    //             }
    //         }
    //     ]);
    //     const statusStats=await Ticket.aggregate([
    //         {
    //             $group:{
    //                 _id:"$status",
    //                 value:{
    //                     $sum:1
    //                 }
    //             }
    //         }
    //     ]);
    //     const formattedOverview={};
    //     ticketOverview.forEach(item=>{
    //         const date=item._id.date;
    //         const status=item._id.status;
    //         const count=item.count;
    //         if(!formattedOverview[date])
    //         {
    //             formattedOverview[date]={
    //                 date:new Date(date).toLocaleDateString(
    //                     "en-IN",
    //                     {
    //                         day:"numeric",
    //                         month:"short"
    //                     }
    //                 ),
    //                 assigned:0,
    //                 open:0,
    //                 inProgress:0,
    //                 resolved:0,
    //                 closed:0
    //             };
    //         }
    //         if(status==="Assigned")
    //         {
    //             formattedOverview[date].assigned=count;
    //         }
    //         else if(status==="Open")
    //         {
    //             formattedOverview[date].open=count;
    //         }
    //         else if(status==="In Progress")
    //         {
    //             formattedOverview[date].inProgress=count;
    //         }
    //         else if(status==="Resolved")
    //         {
    //             formattedOverview[date].resolved=count;
    //         }
    //         if(status==="Closed")
    //         {
    //             formattedOverview[date].closed=count;
    //         }
    //     });
    //     const chartOverview=Object.values(formattedOverview);

    //     res.status(200).json({
    //         totalTickets,
    //         openTickets,
    //         inProgressTickets,
    //         resolvedTickets,
    //         totalStudents,
    //         statusStats,
    //         totalStaff,
    //         totalUsers,
    //         recentTickets,
    //         departmentStats,
    //         categoryStats,
    //         ticketOverview:chartOverview,
    //         resolvedToday
    //     });

    const dashboard=await getDashboardMetrics();
    res.status(200).json(dashboard);
    }
    catch(error)
    {
        return res.status(500).json({
            message:error.message
        })
    }
}
module.exports={
    getStudentDashboard,
    getStaffDashboard,
    getAdminDashboard
};