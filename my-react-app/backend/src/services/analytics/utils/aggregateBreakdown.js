const Ticket=require("../../../models/Ticket.js");


const {
    buildTicketQuery
}=require("../../ai/utils/buildTicketQuery.js");

/**
 * Generic breakdown aggregation.
 *
 * Example:
 *
 * aggregateBreakdown({
 *     field:"department",
 *     filters
 * });
 *
 * Returns:
 *
 * [
 *   {
 *      value:"IT Support",
 *      count:12,
 *      percentage:40
 *   }
 * ]
 */

async function aggregateBreakdown({
    field,
    filters={},
    collection=Ticket,
    match={}
})
{
    if(!field)
    {
        throw new Error(
            "aggregateBreakdown requires a field."
        );
    }

    const query={
        ...buildTicketQuery(filters),
        ...match
    };

    const aggregation=await collection.aggregate([
        {
            $match:query
        },
        {
            $group:{
                _id:`$${field}`,
                count:{
                    $sum:1
                }
            }
        },
        {
            $sort:{
                count:-1
            }
        }
    ]);

    const total=aggregation.reduce(
        (sum,item)=>sum+item.count,
        0
    );

    return aggregation.map(item=>({

        value:item._id,

        count:item.count,

        percentage:
            total===0
            ?0
            :Number(
                (
                    (item.count/total)*100
                ).toFixed(2)
            )

    }));
}

module.exports={
    aggregateBreakdown
};