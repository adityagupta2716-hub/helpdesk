const Ticket=require("../../../models/Ticket.js");


const {
    buildTicketQuery
}=require("../../ai/utils/buildTicketQuery.js");

const ALL_STATUSES=[
    "Open",
    "Assigned",
    "In Progress",
    "Pending Review",
    "Resolved",
    "Closed",
    "Canceled"
];

async function getStatusAnalytics(filters={})
{
    const query=buildTicketQuery(filters);

    const aggregation=await Ticket.aggregate([
        {
            $match:query
        },
        {
            $group:{
                _id:"$status",
                count:{
                    $sum:1
                }
            }
        }
    ]);

    const totalTickets=aggregation.reduce(
        (total,item)=>total+item.count,
        0
    );

    const statusMap=new Map(
        aggregation.map(item=>[
            item._id,
            item.count
        ])
    );

    const statuses=ALL_STATUSES.map(status=>{

        const count=statusMap.get(status)??0;

        return{
            status,
            count,
            percentage:
                totalTickets===0
                ?0
                :Number(
                    (
                        (count/totalTickets)*100
                    ).toFixed(2)
                )
        };
    });

    return{
        totalTickets,
        statuses
    };
}

module.exports={
    getStatusAnalytics
};