const Ticket=require("../../models/Ticket.js");
const User=require("../../models/User.js");

const getDashboardMetrics=async()=>{
    try{
        const today=new Date();
        today.setHours(0,0,0,0);
        const resolvedToday=
        await Ticket.countDocuments({
            resolvedAt:{$gte:today}
        });
        const[
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets
        ]=await Promise.all([
            Ticket.countDocuments(),
            Ticket.countDocuments({status:"Open"}),
            Ticket.countDocuments({status:"In Progress"}),
            Ticket.countDocuments({status:"Resolved"}),
            Ticket.countDocuments({status:"Closed"})
        ]);
        const[
            totalStudents,
            totalStaff,
            totalUsers
        ]=await Promise.all([
            User.countDocuments({role:"student"}),
            User.countDocuments({role:"staff"}),
            User.countDocuments()
        ]);
        const recentTickets=await Ticket.find()
        .populate("createdBy","name email")
        .sort({createdAt:-1}).limit(5);

        const departmentStats=await Ticket.aggregate([
            {
                $group:{
                    _id:"$department",
                    count:{
                        $sum:1
                    }
                }
            }
        ]);
        const categoryStats=await Ticket.aggregate([
            {
                $group:{
                    _id:"$category",
                    value:{$sum:1}
                }
            }
        ]);
        const ticketOverview=await Ticket.aggregate([
            {
                $group:{
                    _id:{
                        date:{
                            $dateToString:{
                                format:"%Y-%m-%d",
                                date:"$createdAt"
                            }
                        },
                        status:"$status"
                    },
                    count:{
                        $sum:1
                    }
                }
            },
            {
                $sort:{
                    "_id.date":1
                }
            }
        ]);
        const statusStats=await Ticket.aggregate([
            {
                $group:{
                    _id:"$status",
                    value:{
                        $sum:1
                    }
                }
            }
        ]);
        const formattedOverview={};
        ticketOverview.forEach(item=>{
            const date=item._id.date;
            const status=item._id.status;
            const count=item.count;
            if(!formattedOverview[date])
            {
                formattedOverview[date]={
                    date:new Date(date).toLocaleDateString(
                        "en-IN",
                        {
                            day:"numeric",
                            month:"short"
                        }
                    ),
                    assigned:0,
                    open:0,
                    inProgress:0,
                    resolved:0,
                    closed:0
                };
            }
            if(status==="Assigned")
            {
                formattedOverview[date].assigned=count;
            }
            else if(status==="Open")
            {
                formattedOverview[date].open=count;
            }
            else if(status==="In Progress")
            {
                formattedOverview[date].inProgress=count;
            }
            else if(status==="Resolved")
            {
                formattedOverview[date].resolved=count;
            }
            if(status==="Closed")
            {
                formattedOverview[date].closed=count;
            }
        });
        const chartOverview=Object.values(formattedOverview);

        return {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            totalStudents,
            statusStats,
            totalStaff,
            totalUsers,
            recentTickets,
            departmentStats,
            categoryStats,
            ticketOverview:chartOverview,
            resolvedToday,
        }

    }
    catch(error)
    {
        throw error;
    }
}

module.exports={
    getDashboardMetrics
};