const {
    aggregateBreakdown
}=require("../utils/aggregateBreakdown.js");

async function getDepartmentAnalytics(filters={})
{
    const departments=await aggregateBreakdown({
        field:"department",
        filters
    });

    return{
        departments
    };
}

module.exports={
    getDepartmentAnalytics
};