const {
    aggregateBreakdown
}=require("../utils/aggregateBreakdown.js");

async function getCategoryAnalytics(filters={})
{
    const categories=await aggregateBreakdown({
        field:"category",
        filters
    });

    return{
        categories
    };
}

module.exports={
    getCategoryAnalytics
};