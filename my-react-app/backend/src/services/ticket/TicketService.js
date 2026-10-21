const Ticket=require("../../models/Ticket.js");
const User=require("../../models/User.js");
const Notification=require("../../models/Notification.js");
const TicketTimeline=require("../../models/TicketTimeline.js");
const {
    buildDateQuery
}=require("../ai/utils/dateQueryBuilder.js");

const createTicket=async({
    title,
    description,
    department,
    category,
    priority="Medium",
    createdBy,
    createdByName="Student"
})=>{
    const ticket=await Ticket.create({
        title,
        description,
        department,
        category,
        priority,
        status:"Open",
        createdBy
    });

    await TicketTimeline.create({
        ticket:ticket._id,
        title:"Ticket Created",
        description:"Student created the ticket",
        eventType:"created"
    });
    

    // const admins=await User.find({
    //     role:"admin"
    // });

    // for(const admin of admins)
    // {
    //     await Notification.create({
    //         user:admin._id,
    //         title:"New Ticket Created",
    //         message:`${createdByName} created "${ticket.title}"`
    //     });
    // }

    return ticket;
};

const getMyTickets=async({
    userId
})=>{
    return await Ticket.find({
        createdBy:userId
    }).sort({createdAt:-1});
};

const getAllTickets=async({
    limit=5,
    includeAll=false,
    status=null,
    priority=null,
    department=null,
    category=null,
    dateFilter=null,
    sortBy="createdAt",
    sortOrder="desc"
}={})=>{

    const query={};

    if(status)
    {
        query.status=status;
    }

    if(priority)
    {
        query.priority=priority;
    }

    if(department)
    {
        query.department=department;
    }

    if(category)
    {
        query.category=category;
    }

    if(dateFilter)
    {
        query.createdAt=buildDateQuery(dateFilter);
    }

    const sortOption={};
    sortOption[sortBy]=sortOrder==="asc"?1:-1;

    let tickets=await Ticket.find(query)
    .populate(
        "createdBy",
        "name email role"
    )
    .populate(
        "assignedTo",
        "name email department"
    )
    .sort(sortOption);

    const totalTickets=tickets.length;

    if(!includeAll)
    {
        tickets=tickets.slice(0,limit);
    }

    return{
        totalTickets,

        returnedTickets:tickets.length,

        hasMore:totalTickets>tickets.length,

        tickets
    };
};

const getAdminInsights=async()=>
{

}

module.exports={
    createTicket,
    getMyTickets,
    getAllTickets,
    getAdminInsights
};