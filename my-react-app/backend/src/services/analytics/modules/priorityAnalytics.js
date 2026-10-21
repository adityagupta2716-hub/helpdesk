const {
    aggregateBreakdown
}=require("../utils/aggregateBreakdown.js");

async function getPriorityAnalytics(filters={})
{
    const priorities=await aggregateBreakdown({
        field:"priority",
        filters
    });

    return{
        priorities
    };
}

module.exports={
    getPriorityAnalytics
};